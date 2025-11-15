import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";

const appTest = new App().app;

describe("POST /tingkatan - Create Tingkatan Kelas", () => {
  // Kita perlu buat Admin dummy dulu agar relasinya valid
  beforeAll(async () => {
    await prisma.admin.create({
      data: {
        id: "dummy-admin-id-untuk-tes",
        nama: "Admin Tester",
        user: {
          create: {
            username: "admin.test",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });
  });

  // Bersihkan data setelah tes
  afterAll(async () => {
    await prisma.tingkatanKelas.deleteMany();
    await prisma.admin.deleteMany({
      where: { id: "dummy-admin-id-untuk-tes" },
    });
    await prisma.user.deleteMany({
      where: { username: "admin.test" },
    });
    await prisma.$disconnect();
  });

  it("Should create a new tingkatan kelas", async () => {
    const response = await request(appTest).post("/tingkatan").send({
      namaTingkat: "Tingkat 10",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.namaTingkat).toBe("Tingkat 10");
  });

  it("Should fail if namaTingkat is empty", async () => {
    const response = await request(appTest).post("/tingkatan").send({
      namaTingkat: "",
    });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Nama tingkatan wajib diisi");
  });
});