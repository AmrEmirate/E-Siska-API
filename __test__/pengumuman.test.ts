import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { User } from "../src/generated/prisma";

const appTest = new App().app;

describe("POST /pengumuman - Create Pengumuman", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-pengumuman";
  let adminUserTest: User;

  beforeAll(async () => {
    
    const adminData = await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Pengumuman",
        user: {
          create: {
            username: "admin.test.pengumuman",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
      include: { user: true },
    });
    adminUserTest = adminData.user;
  });

  afterAll(async () => {
    await prisma.pengumuman.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({
      where: { username: "admin.test.pengumuman" },
    });
    await prisma.$disconnect();
  });

  it("Should create a new pengumuman", async () => {
    const response = await request(appTest).post("/pengumuman").send({
      judul: "Libur Sekolah",
      konten: "Sekolah diliburkan tanggal 25 Desember.",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.judul).toBe("Libur Sekolah");
    expect(response.body.data.adminId).toBe(adminUserTest.id); 
  });

  it("Should fail if judul is empty", async () => {
    const response = await request(appTest).post("/pengumuman").send({
      konten: "Konten tanpa judul",
    });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Judul pengumuman wajib diisi");
  });
});