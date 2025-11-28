import {
  setupTestUser,
  cleanupTestUser,
  appTest,
  TEST_ADMIN_CREDENTIALS,
} from "./test-helpers";
import request from "supertest";

describe("Authentication", () => {
  beforeAll(async () => {
    await setupTestUser();
  });

  afterAll(async () => {
    await cleanupTestUser();
  });

  it("Should login successfully with correct data", async () => {
    const response = await request(appTest).post("/api/auth/signin").send({
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toHaveProperty("token");
  });

  it("Should fail login with incorrect password", async () => {
    const response = await request(appTest).post("/api/auth/signin").send({
      username: TEST_ADMIN_CREDENTIALS.username,
      password: "WrongPassword123!",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password salah");
  });

  it("Should fail login with non-existent user", async () => {
    const response = await request(appTest).post("/api/auth/signin").send({
      username: "nonexistent@user.com",
      password: "SomePassword123!",
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Akun tidak ditemukan");
  });
});
