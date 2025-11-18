import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, MataPelajaran, Siswa } from "../src/generated/prisma";

const appTest = new App().app;

describe("POST /capaian - Input Capaian Kompetensi", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-capaian";
  let guruTest: Guru;
  let mapelWajib: MataPelajaran;
  let mapelEskul: MataPelajaran;
  let siswaTest: Siswa;

  beforeAll(async () => {
    // Setup Admin, Guru, Siswa
    await prisma.admin.upsert({ where: { id: ADMIN_ID_DUMMY }, update: {}, create: { id: ADMIN_ID_DUMMY, nama: "Admin Capaian", user: { create: { username: "admin.capaian", passwordHash: "hash", role: "ADMIN" } } } });
    guruTest = await prisma.guru.create({ data: { nama: "Guru Capaian", nip: "G-CAPAIAN", user: { create: { username: "guru.capaian", passwordHash: "hash", role: "GURU" } } } });
    siswaTest = await prisma.siswa.create({ data: { nama: "Siswa Capaian", nis: "S-CAPAIAN", user: { create: { username: "s.capaian", passwordHash: "hash", role: "SISWA" } } } });

    // Setup Mapel & Skema
    mapelWajib = await prisma.mataPelajaran.create({ data: { namaMapel: "Biologi", kategori: "WAJIB", adminId: ADMIN_ID_DUMMY, SkemaPenilaian: { create: { adminId: ADMIN_ID_DUMMY } } } });
    mapelEskul = await prisma.mataPelajaran.create({ data: { namaMapel: "Basket", kategori: "EKSTRAKURIKULER", adminId: ADMIN_ID_DUMMY, SkemaPenilaian: { create: { adminId: ADMIN_ID_DUMMY } } } });

    // Setup Kelas & Penugasan
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Capaian", adminId: ADMIN_ID_DUMMY } });
    const kelas = await prisma.kelas.create({ data: { namaKelas: "Kelas Capaian", tingkatanId: tingkatan.id } });
    
    await prisma.penugasanGuru.createMany({
      data: [
        { guruId: guruTest.id, mapelId: mapelWajib.id, kelasId: kelas.id },
        { guruId: guruTest.id, mapelId: mapelEskul.id, kelasId: kelas.id }
      ]
    });
  });

  afterAll(async () => {
    await prisma.capaianKompetensi.deleteMany();
    await prisma.penugasanGuru.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({ where: { username: { in: ["admin.capaian", "guru.capaian", "s.capaian"] } } });
    await prisma.$disconnect();
  });

  it("Should submit competency description successfully", async () => {
    const response = await request(appTest).post("/capaian").send({
      guruId: guruTest.id,
      mapelId: mapelWajib.id,
      data: [{ siswaId: siswaTest.id, deskripsi: "Sangat memahami konsep sel." }]
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    
    const savedData = await prisma.capaianKompetensi.findUnique({ 
        where: { siswaId_mapelId: { siswaId: siswaTest.id, mapelId: mapelWajib.id } } 
    });
    expect(savedData?.deskripsi).toBe("Sangat memahami konsep sel.");
  });

  it("Should fail if mapel is EKSTRAKURIKULER", async () => {
    const response = await request(appTest).post("/capaian").send({
      guruId: guruTest.id,
      mapelId: mapelEskul.id, // Ini ESKUL
      data: [{ siswaId: siswaTest.id, deskripsi: "Jago dribble" }]
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Ekstrakurikuler menggunakan menu input nilai tersendiri");
  });
});