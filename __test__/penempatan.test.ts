import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Siswa, Kelas, TahunAjaran } from "../src/generated/prisma";

const appTest = new App().app;

describe("POST /penempatan - Create Penempatan Siswa", () => {
  let siswaTest: Siswa;
  let kelasTest: Kelas;
  let taTest: TahunAjaran;
  const ADMIN_ID_DUMMY = "dummy-admin-id-penempatan";

  beforeAll(async () => {
    // 1. Buat Admin
    await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Penempatan",
        user: {
          create: {
            username: "admin.test.penempatan",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });
    // 2. Buat Siswa
    siswaTest = (
      await prisma.siswa.create({
        data: {
          nis: "TEST-NIS-001",
          nama: "Siswa Penempatan",
          user: {
            create: {
              username: "TEST-NIS-001",
              passwordHash: "dummyhash",
              role: "SISWA",
            },
          },
        },
      })
    );
    // 3. Buat Tingkatan & Kelas
    const tingkatan = await prisma.tingkatanKelas.create({
      data: { namaTingkat: "Tingkat Penempatan", adminId: ADMIN_ID_DUMMY },
    });
    kelasTest = await prisma.kelas.create({
      data: {
        namaKelas: "Kelas Penempatan",
        tingkatanId: tingkatan.id,
      },
    });
    // 4. Buat Tahun Ajaran
    taTest = await prisma.tahunAjaran.create({
      data: { nama: "TA Penempatan", adminId: ADMIN_ID_DUMMY },
    });
  });

  afterAll(async () => {
    // Hapus data dengan urutan terbalik
    await prisma.penempatanSiswa.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.tahunAjaran.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({
      where: { username: { in: ["admin.test.penempatan", "TEST-NIS-001"] } },
    });
    await prisma.$disconnect();
  });

  it("Should successfully place a student in a class", async () => {
    const response = await request(appTest).post("/penempatan").send({
      siswaId: siswaTest.id,
      kelasId: kelasTest.id,
      tahunAjaranId: taTest.id,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.siswaId).toBe(siswaTest.id);
    expect(response.body.data.kelasId).toBe(kelasTest.id);
  });

  it("Should fail if student is already placed in that year", async () => {
    // Coba tempatkan siswa yang sama di tahun ajaran yang sama (meski kelas beda)
    const response = await request(appTest).post("/penempatan").send({
      siswaId: siswaTest.id, // Siswa yang sama
      kelasId: kelasTest.id, // Kelas lain (atau sama, tidak masalah)
      tahunAjaranId: taTest.id, // Tahun Ajaran yang sama
    });

    expect(response.status).toBe(409); // 409 Conflict
    expect(response.body.message).toContain(
      "Siswa ini sudah ditempatkan di kelas lain",
    );
  });

  it("Should fail if siswaId is invalid UUID", async () => {
    const response = await request(appTest).post("/penempatan").send({
      siswaId: "bukan-uuid",
      kelasId: kelasTest.id,
      tahunAjaranId: taTest.id,
    });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Format siswaId tidak valid");
  });
});