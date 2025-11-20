import request from "supertest";
import express from "express";
import KelasRouter from "../src/routers/kelas.router";
import MapelRouter from "../src/routers/mapel.router";
import RuanganRouter from "../src/routers/ruangan.router";
import { prisma } from "../src/config/prisma";

const app = express();
app.use(express.json());
app.use("/kelas", new KelasRouter().getRouter());
app.use("/mapel", new MapelRouter().getRouter());
app.use("/ruangan", new RuanganRouter().getRouter());

describe("Master Data CRUD Features", () => {
  let adminId: string;
  let tingkatanId: string;
  let guruId: string;

  beforeAll(async () => {
    // Clean up DB first
    await prisma.nilaiDetailSiswa.deleteMany();
    await prisma.penugasanGuru.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.ruangan.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    // 1. Buat Admin
    const userAdmin = await prisma.user.create({
      data: {
        username: "admin.test",
        passwordHash: "hash",
        role: "ADMIN",
      },
    });
    const admin = await prisma.admin.create({
      data: {
        userId: userAdmin.id,
        nama: "Admin Test",
      },
    });
    adminId = admin.id;

    // 2. Buat Tingkatan
    const tingkatan = await prisma.tingkatanKelas.create({
      data: { 
        namaTingkat: "Kelas 10", 
        adminId: adminId 
      },
    });
    tingkatanId = tingkatan.id;

    // 3. Buat Guru
    const userGuru = await prisma.user.create({
      data: {
        username: "guru.test",
        passwordHash: "hash",
        role: "GURU",
      },
    });
    const guru = await prisma.guru.create({
      data: { 
        userId: userGuru.id,
        nip: "123456", 
        nama: "Guru Test" 
      },
    });
    guruId = guru.id;
  });

  afterAll(async () => {
    await prisma.nilaiDetailSiswa.deleteMany();
    await prisma.penugasanGuru.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.ruangan.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe("Kelas Management", () => {
    let kelasId: string;

    it("should create a new kelas", async () => {
      const res = await request(app).post("/kelas").send({
        namaKelas: "X-IPA-1",
        tingkatanId: tingkatanId,
        waliKelasId: guruId,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.namaKelas).toBe("X-IPA-1");
      kelasId = res.body.data.id;
    });

    it("should update kelas", async () => {
      const res = await request(app).put(`/kelas/${kelasId}`).send({
        namaKelas: "X-IPA-1 Updated",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.namaKelas).toBe("X-IPA-1 Updated");
    });

    it("should delete kelas", async () => {
      const res = await request(app).delete(`/kelas/${kelasId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await prisma.kelas.findUnique({ where: { id: kelasId } });
      expect(check).toBeNull();
    });
  });

  describe("Mata Pelajaran Management", () => {
    let mapelId: string;

    it("should create a new mapel", async () => {
      const res = await request(app).post("/mapel").send({
        namaMapel: "Matematika",
        kategori: "WAJIB",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.mapel.namaMapel).toBe("Matematika");
      mapelId = res.body.data.mapel.id;
    });

    it("should update mapel", async () => {
      const res = await request(app).put(`/mapel/${mapelId}`).send({
        namaMapel: "Matematika Lanjut",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.namaMapel).toBe("Matematika Lanjut");
    });

    it("should delete mapel", async () => {
      const res = await request(app).delete(`/mapel/${mapelId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await prisma.mataPelajaran.findUnique({ where: { id: mapelId } });
      expect(check).toBeNull();
    });
  });

  describe("Ruangan Management", () => {
    let ruanganId: string;

    it("should create a new ruangan", async () => {
      const res = await request(app).post("/ruangan").send({
        namaRuangan: "Lab Komputer",
        kapasitas: 30,
        adminId: adminId // Assuming the service handles this or uses a dummy
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.namaRuangan).toBe("Lab Komputer");
      ruanganId = res.body.data.id;
    });

    it("should update ruangan", async () => {
      const res = await request(app).put(`/ruangan/${ruanganId}`).send({
        kapasitas: 35,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.kapasitas).toBe(35);
    });

    it("should delete ruangan", async () => {
      const res = await request(app).delete(`/ruangan/${ruanganId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await prisma.ruangan.findUnique({ where: { id: ruanganId } });
      expect(check).toBeNull();
    });
  });
});
