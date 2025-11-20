import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { TingkatanKelas } from "../src/generated/prisma";
const appTest = new App().app;
describe("POST /kelas - Create Kelas", () => {
  let tingkatanTest: TingkatanKelas;
  beforeAll(async () => {
    await prisma.admin.create({
      data: {
        id: "dummy-admin-id-kelas",
        nama: "Admin Tester Kelas",
        user: {
          create: {
            username: "admin.test.kelas",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });
    tingkatanTest = await prisma.tingkatanKelas.create({
      data: {
        namaTingkat: "Tingkat Uji Kelas",
        adminId: "dummy-admin-id-kelas",
      },
    });
  });
  afterAll(async () => {
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.admin.deleteMany({
      where: { id: "dummy-admin-id-kelas" },
    });
    await prisma.user.deleteMany({
      where: { username: "admin.test.kelas" },
    });
    await prisma.$disconnect();
  });
  it("Should create a new kelas", async () => {
    const response = await request(appTest).post("/kelas").send({
      namaKelas: "Kelas 10 Uji",
      tingkatanId: tingkatanTest.id, 
    });
    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.namaKelas).toBe("Kelas 10 Uji");
    expect(response.body.data.tingkatanId).toBe(tingkatanTest.id);
  });
  it("Should fail if tingkatanId is not valid", async () => {
    const response = await request(appTest).post("/kelas").send({
      namaKelas: "Kelas Gagal",
      tingkatanId: "bukan-uuid",
    });
    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Format ID Tingkatan tidak valid");
  });
  it("Should fail if tingkatanId does not exist", async () => {
    const randomUuid = "077a98a0-05e8-424a-8d76-6d60c62e6e3c";
    const response = await request(appTest).post("/kelas").send({
      namaKelas: "Kelas Gagal",
      tingkatanId: randomUuid, 
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Tingkatan Kelas tidak ditemukan");
  });
});