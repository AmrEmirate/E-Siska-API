import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, Siswa, Kelas, TahunAjaran, NilaiKomponen } from "../src/generated/prisma"; 

const appTest = new App().app;

describe("POST /rapor/siswa/:siswaId/generate - Generate Rapor", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-gen-rapor";
  let waliKelas: Guru;
  let siswaTest: Siswa;
  let taTest: TahunAjaran;
  let kelasTest: Kelas;
  
  let mapelWajib: any; 
  let komponenAkhir: NilaiKomponen;

  beforeAll(async () => {
    
    await prisma.admin.upsert({ where: { id: ADMIN_ID_DUMMY }, update: {}, create: { id: ADMIN_ID_DUMMY, nama: "Admin Gen", user: { create: { username: "admin.gen", passwordHash: "hash", role: "ADMIN" } } } });
    waliKelas = await prisma.guru.create({ data: { nama: "Wali Gen", nip: "G-GEN", user: { create: { username: "wali.gen", passwordHash: "hash", role: "GURU" } } } });
    taTest = await prisma.tahunAjaran.create({ data: { nama: "TA Gen", adminId: ADMIN_ID_DUMMY } });
    
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Gen", adminId: ADMIN_ID_DUMMY } });
    kelasTest = await prisma.kelas.create({ data: { namaKelas: "Kelas Gen", tingkatanId: tingkatan.id, waliKelasId: waliKelas.id } });
    
    siswaTest = await prisma.siswa.create({ data: { nama: "Siswa Gen", nis: "S-GEN", user: { create: { username: "s.gen", passwordHash: "hash", role: "SISWA" } } } });
    await prisma.penempatanSiswa.create({ data: { siswaId: siswaTest.id, kelasId: kelasTest.id, tahunAjaranId: taTest.id } });

    
    mapelWajib = await prisma.mataPelajaran.create({ 
        data: { 
            namaMapel: "Matematika", kategori: "WAJIB", adminId: ADMIN_ID_DUMMY, 
            SkemaPenilaian: { 
                create: { 
                    adminId: ADMIN_ID_DUMMY, 
                    Komponen: { create: { namaKomponen: "Nilai Akhir", tipe: "INPUT", urutan: 1 } } 
                } 
            } 
        },
        include: { SkemaPenilaian: { include: { Komponen: true } } }
    });
    
    
    komponenAkhir = mapelWajib.SkemaPenilaian?.[0]?.Komponen?.[0];

    
    if (komponenAkhir) {
      await prisma.nilaiDetailSiswa.create({
          data: {
              siswaId: siswaTest.id, mapelId: mapelWajib.id, komponenId: komponenAkhir.id,
              guruId: waliKelas.id, nilaiAngka: 95
          }
      });
    }
  });

  afterAll(async () => {
    
    await prisma.nilaiDetailSiswa.deleteMany();
    await prisma.penempatanSiswa.deleteMany();
    await prisma.penugasanGuru.deleteMany();
    await prisma.nilaiKomponen.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.tahunAjaran.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({ where: { username: { in: ["admin.gen", "wali.gen", "s.gen"] } } });
    await prisma.$disconnect();
  });

  it("Should generate complete rapor JSON", async () => {
    const response = await request(appTest)
        .post(`/rapor/siswa/${siswaTest.id}/generate`)
        .send({
            guruId: waliKelas.id,
            tahunAjaranId: taTest.id
        });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    
    const data = response.body.data;
    expect(data.infoSiswa.nama).toBe("Siswa Gen");
    expect(data.nilaiAkademik[0].mapel).toBe("Matematika");
    expect(data.nilaiAkademik[0].nilaiAkhir).toBe(95);
    expect(data.nilaiAkademik[0].predikat).toBe("A");
    expect(data.status).toBe("DRAFT");
  });
});