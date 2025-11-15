import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";

const appTest = new App().app;

describe("POST /tahun-ajaran - Create Tahun Ajaran", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-untuk-tes";

  beforeAll(async () => {
    // Pastikan admin dummy ada
    await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester TA",
        user: {
          create: {
            username: "admin.test.ta",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.tahunAjaran.deleteMany();
    // Hapus admin dan user dummy
    await prisma.admin.deleteMany({
      where: { id: ADMIN_ID_DUMMY },
    });
    await prisma.user.deleteMany({
      where: { username: "admin.test.ta" },
    });
    await prisma.$disconnect();
  });

  it("Should create a new tahun ajaran (default inactive)", async () => {
    const response = await request(appTest).post("/tahun-ajaran").send({
      nama: "2025/2026 Ganjil",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.nama).toBe("2025/2026 Ganjil");
    expect(response.body.data.isAktif).toBe(false); // Cek default value
  });

  it("Should fail if nama is empty", async () => {
    const response = await request(appTest).post("/tahun-ajaran").send({
      nama: "",
    });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Nama tahun ajaran wajib diisi");
  });
});