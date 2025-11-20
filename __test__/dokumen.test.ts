import App from "../src/app";
import request from "supertest";
import path from "path"; 
import { prisma } from "../src/config/prisma";
import { User } from "../src/generated/prisma";
const appTest = new App().app;
jest.mock("../src/config/cloudinary", () => ({
  cloudinaryUpload: jest.fn(() =>
    Promise.resolve({
      secure_url: "http://dummy.cloudinary.com/file.pdf",
    }),
  ),
}));
describe("POST /dokumen - Upload Dokumen", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-dokumen";
  let adminUserTest: User;
  beforeAll(async () => {
    const adminData = await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Dokumen",
        user: {
          create: {
            username: "admin.test.dokumen",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
      include: { user: true },
    });
    adminUserTest = adminData.user;
    await prisma.admin.upsert({
      where: { id: "dummy-admin-id-untuk-tes" },
      update: {},
      create: {
        id: "dummy-admin-id-untuk-tes",
        nama: "Admin Dummy for Dokumen Service",
        userId: adminUserTest.id, 
      },
    });
  });
  afterAll(async () => {
    await prisma.dokumen.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    jest.restoreAllMocks(); 
  });
  it("Should upload a document successfully", async () => {
    const dummyFilePath = path.resolve(__dirname, "app.test.ts"); 
    const response = await request(appTest)
      .post("/dokumen")
      .field("judul", "Panduan Belajar") 
      .attach("file", dummyFilePath); 
    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.judul).toBe("Panduan Belajar");
    expect(response.body.data.urlFile).toBe(
      "http://dummy.cloudinary.com/file.pdf",
    );
  });
  it("Should fail if no file is attached", async () => {
    const response = await request(appTest)
      .post("/dokumen")
      .field("judul", "Gagal Upload");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("File dokumen wajib diupload");
  });
  it("Should fail if judul is empty", async () => {
    const dummyFilePath = path.resolve(__dirname, "app.test.ts");
    const response = await request(appTest)
      .post("/dokumen")
      .attach("file", dummyFilePath); 
    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Judul dokumen wajib diisi");
  });
});