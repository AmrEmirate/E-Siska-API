import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
const appTest = new App().app;
describe("POST /mapel - Create Mata Pelajaran", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-untuk-tes";
  beforeAll(async () => {
    await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Mapel",
        user: {
          create: {
            username: "admin.test.mapel",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });
  });
  afterAll(async () => {
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.admin.deleteMany({
      where: { id: ADMIN_ID_DUMMY },
    });
    await prisma.user.deleteMany({
      where: { username: "admin.test.mapel" },
    });
    await prisma.$disconnect();
  });
  it("Should create a new 'WAJIB' mapel and its skema", async () => {
    const response = await request(appTest).post("/mapel").send({
      namaMapel: "Matematika",
      kategori: "WAJIB",
    });
    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.mapel.namaMapel).toBe("Matematika");
    expect(response.body.data.mapel.kategori).toBe("WAJIB");
    
    expect(response.body.data.skema).toBeDefined();
    expect(response.body.data.skema.mapelId).toBe(response.body.data.mapel.id);
  });
  it("Should create a new 'EKSTRAKURIKULER' mapel and its skema", async () => {
    const response = await request(appTest).post("/mapel").send({
      namaMapel: "Pramuka",
      kategori: "EKSTRAKURIKULER",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.mapel.kategori).toBe("EKSTRAKURIKULER");
    expect(response.body.data.skema).toBeDefined(); 
  });
  it("Should fail if kategori is invalid", async () => {
    const response = await request(appTest).post("/mapel").send({
      namaMapel: "Mapel Aneh",
      kategori: "INVALID_KATEGORI",
    });
    expect(response.status).toBe(400);
    expect(response.body[0].msg).toContain("Kategori tidak valid");
  });
});