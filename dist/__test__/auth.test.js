"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("./test-helpers");
const supertest_1 = __importDefault(require("supertest"));
describe("Authentication", () => {
    beforeAll(async () => {
        await (0, test_helpers_1.setupTestUser)();
    });
    afterAll(async () => {
        await (0, test_helpers_1.cleanupTestUser)();
    });
    it("Should login successfully with correct data", async () => {
        const response = await (0, supertest_1.default)(test_helpers_1.appTest).post("/api/auth/signin").send({
            username: test_helpers_1.TEST_ADMIN_CREDENTIALS.username,
            password: test_helpers_1.TEST_ADMIN_CREDENTIALS.password,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).toHaveProperty("token");
    });
    it("Should fail login with incorrect password", async () => {
        const response = await (0, supertest_1.default)(test_helpers_1.appTest).post("/api/auth/signin").send({
            username: test_helpers_1.TEST_ADMIN_CREDENTIALS.username,
            password: "WrongPassword123!",
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Password salah");
    });
    it("Should fail login with non-existent user", async () => {
        const response = await (0, supertest_1.default)(test_helpers_1.appTest).post("/api/auth/signin").send({
            username: "nonexistent@user.com",
            password: "SomePassword123!",
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Akun tidak ditemukan");
    });
});
