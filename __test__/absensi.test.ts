import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, Kelas } from "../src/generated/prisma";
const appTest = new App().app;
describe("POST /absensi/sesi - Create Sesi Absensi", () => {
  let guruTest: Guru;
  let kelasTest: Kelas;
  const ADMIN_ID_DUMMY = "dummy-admin-id-absensi";
  beforeAll(async () => {
    await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: { id: ADMIN_ID_DUMMY, nama: "Admin Absensi", user: { create: { username: "admin.absensi", passwordHash: "hash", role: "ADMIN" } } },
    });
    guruTest = await prisma.guru.create({
      data: { nama: "Guru Absensi", nip: "G-ABSENSI", user: { create: { username: "guru.absensi", passwordHash: "hash", role: "GURU" } } },
    });
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Absensi", adminId: ADMIN_ID_DUMMY } });
    kelasTest = await prisma.kelas.create({ data: { namaKelas: "Kelas Absensi", tingkatanId: tingkatan.id } });
    
    const mapel = await prisma.mataPelajaran.create({ 
        data: { namaMapel: "Mapel Absensi", kategori: "WAJIB", adminId: ADMIN_ID_DUMMY, SkemaPenilaian: { create: { adminId: ADMIN_ID_DUMMY } } } 
    });
    await prisma.penugasanGuru.create({
      data: { guruId: guruTest.id, mapelId: mapel.id, kelasId: kelasTest.id },
    });
  });
  afterAll(async () => {
    await prisma.absensiSesi.deleteMany();
    await prisma.penugasanGuru.deleteMany();
    await prisma.mataPelajaran.deleteMany(); 
    await prisma.skemaPenilaian.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({ where: { username: { in: ["admin.absensi", "guru.absensi"] } } });
    await prisma.$disconnect();
  });
  it("Should create a new sesi if guru is assigned", async () => {
    const response = await request(appTest).post("/absensi/sesi").send({
      guruId: guruTest.id,
      kelasId: kelasTest.id,
      tanggal: "2025-11-06",
      pertemuanKe: 1,
    });
    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.pertemuanKe).toBe(1);
  });
  it("Should fail if guru is NOT assigned to class", async () => {
    const tingkatanBaru = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Asing", adminId: ADMIN_ID_DUMMY } });
    const kelasAsing = await prisma.kelas.create({ data: { namaKelas: "Kelas Asing", tingkatanId: tingkatanBaru.id } });
    const response = await request(appTest).post("/absensi/sesi").send({
      guruId: guruTest.id,
      kelasId: kelasAsing.id, 
      tanggal: "2025-11-06",
      pertemuanKe: 1,
    });
    expect(response.status).toBe(403); 
    expect(response.body.message).toContain("Guru tidak terdaftar mengajar di kelas ini");
    await prisma.kelas.delete({ where: { id: kelasAsing.id } });
    await prisma.tingkatanKelas.delete({ where: { id: tingkatanBaru.id } });
  });
});