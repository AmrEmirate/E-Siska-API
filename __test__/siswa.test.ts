import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";

const appTest = new App().app;

describe("POST /siswa - Create Siswa", () => {
  // Bersihkan database setelah tes
  afterAll(async () => {
    await prisma.siswa.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("Should create a new siswa and user account", async () => {
    const nis = "123456789";
    const response = await request(appTest).post("/siswa").send({
      nama: "Siswa Uji Coba",
      nis: nis,
      tanggalLahir: "2010-01-01",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.siswa.nama).toBe("Siswa Uji Coba");
    expect(response.body.data.siswa.nis).toBe(nis);
    expect(response.body.data.user.username).toBe(nis);
    expect(response.body.data.user.role).toBe("SISWA");
    expect(response.body.data.user.passwordHash).toBeUndefined(); // Pastikan hash tidak dikirim
  });

  it("Should fail if NIS is too short", async () => {
    const response = await request(appTest).post("/siswa").send({
      nama: "Siswa Gagal",
      nis: "123", // Kurang dari 6
    });

    expect(response.status).toBe(400); // 400 dari validator
    expect(response.body[0].msg).toBe("NIS harus memiliki minimal 6 digit");
  });

  it("Should fail if Nama is empty", async () => {
    const response = await request(appTest).post("/siswa").send({
      nis: "987654321",
    });

    expect(response.status).toBe(400); // 400 dari validator
    expect(response.body[0].msg).toBe("Nama siswa wajib diisi");
  });
});