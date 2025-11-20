import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, MataPelajaran, Siswa } from "../src/generated/prisma";
const appTest = new App().app;
describe("POST /nilai-ekskul - Input Nilai Ekstrakurikuler", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-ekskul";
  let guruTest: Guru;
  let mapelEkskul: MataPelajaran;
  let mapelWajib: MataPelajaran;
  let siswaTest: Siswa;
  beforeAll(async () => {
    await prisma.admin.upsert({ where: { id: ADMIN_ID_DUMMY }, update: {}, create: { id: ADMIN_ID_DUMMY, nama: "Admin Ekskul", user: { create: { username: "admin.ekskul", passwordHash: "hash", role: "ADMIN" } } } });
    guruTest = await prisma.guru.create({ data: { nama: "Guru Ekskul", nip: "G-EKSKUL", user: { create: { username: "guru.ekskul", passwordHash: "hash", role: "GURU" } } } });
    siswaTest = await prisma.siswa.create({ data: { nama: "Siswa Ekskul", nis: "S-EKSKUL", user: { create: { username: "s.ekskul", passwordHash: "hash", role: "SISWA" } } } });
    mapelEkskul = await prisma.mataPelajaran.create({ data: { namaMapel: "Pramuka", kategori: "EKSTRAKURIKULER", adminId: ADMIN_ID_DUMMY, SkemaPenilaian: { create: { adminId: ADMIN_ID_DUMMY } } } });
    mapelWajib = await prisma.mataPelajaran.create({ data: { namaMapel: "Matematika", kategori: "WAJIB", adminId: ADMIN_ID_DUMMY, SkemaPenilaian: { create: { adminId: ADMIN_ID_DUMMY } } } });
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Ekskul", adminId: ADMIN_ID_DUMMY } });
    const kelas = await prisma.kelas.create({ data: { namaKelas: "Kelas Ekskul", tingkatanId: tingkatan.id } });
    
    await prisma.penugasanGuru.createMany({
      data: [
        { guruId: guruTest.id, mapelId: mapelEkskul.id, kelasId: kelas.id },
        { guruId: guruTest.id, mapelId: mapelWajib.id, kelasId: kelas.id }
      ]
    });
  });
  afterAll(async () => {
    await prisma.nilaiDetailSiswa.deleteMany();
    await prisma.penugasanGuru.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({ where: { username: { in: ["admin.ekskul", "guru.ekskul", "s.ekskul"] } } });
    await prisma.$disconnect();
  });
  it("Should submit description for EKSTRAKURIKULER successfully", async () => {
    const response = await request(appTest).post("/nilai-ekskul").send({
      guruId: guruTest.id,
      mapelId: mapelEkskul.id,
      data: [{ siswaId: siswaTest.id, deskripsi: "Sangat Baik dan Aktif" }]
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    
    const savedData = await prisma.nilaiDetailSiswa.findFirst({ where: { siswaId: siswaTest.id, mapelId: mapelEkskul.id } });
    expect(savedData?.nilaiDeskripsi).toBe("Sangat Baik dan Aktif");
    expect(savedData?.nilaiAngka).toBeNull();
    expect(savedData?.komponenId).toBeNull();
  });
  it("Should fail if mapel is NOT EKSTRAKURIKULER", async () => {
    const response = await request(appTest).post("/nilai-ekskul").send({
      guruId: guruTest.id,
      mapelId: mapelWajib.id, 
      data: [{ siswaId: siswaTest.id, deskripsi: "Coba-coba" }]
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("khusus untuk kategori EKSTRAKURIKULER");
  });
});