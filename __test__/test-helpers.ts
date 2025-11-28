import request from "supertest";
import App from "../src/app";
import { prisma } from "../src/config/prisma";
import * as bcrypt from "bcrypt";

const appTest = new App().app;

// Test user credentials
export const TEST_ADMIN_CREDENTIALS = {
  username: "admin.test.main",
  password: "TestPassword123!",
};

let authTokenCache: string | null = null;

/**
 * Setup test admin user in database
 */
export async function setupTestUser() {
  const hashedPassword = await bcrypt.hash(TEST_ADMIN_CREDENTIALS.password, 10);

  try {
    await prisma.admin.upsert({
      where: { id: "test-admin-main-id" },
      update: {},
      create: {
        id: "test-admin-main-id",
        nama: "Test Admin",
        user: {
          create: {
            username: TEST_ADMIN_CREDENTIALS.username,
            passwordHash: hashedPassword,
            role: "ADMIN",
          },
        },
      },
    });
  } catch (error) {
    // User might already exist, which is fine
  }
}

/**
 * Helper function to get authentication token
 * @returns Promise<string> - JWT token
 */
export async function getAuthToken(
  credentials = TEST_ADMIN_CREDENTIALS
): Promise<string> {
  // Return cached token if available
  if (authTokenCache && credentials === TEST_ADMIN_CREDENTIALS) {
    return authTokenCache;
  }

  // Ensure test user exists
  await setupTestUser();

  const response = await request(appTest)
    .post("/api/auth/signin")
    .send(credentials);

  if (response.status !== 200) {
    throw new Error(`Failed to authenticate: ${JSON.stringify(response.body)}`);
  }

  const token = response.body.data.token as string;
  authTokenCache = token;
  return token;
}

/**
 * Helper function to make authenticated requests
 * @param method - HTTP method
 * @param path - API path
 * @param token - JWT token
 * @returns supertest request with auth header
 */
export function authenticatedRequest(
  method: "get" | "post" | "put" | "delete" | "patch",
  path: string,
  token: string
) {
  return request(appTest)[method](path).set("Authorization", `Bearer ${token}`);
}

/**
 * Cleanup test user
 */
export async function cleanupTestUser() {
  try {
    await prisma.admin.delete({ where: { id: "test-admin-main-id" } });
    await prisma.user.delete({
      where: { username: TEST_ADMIN_CREDENTIALS.username },
    });
  } catch (error) {
    // User might not exist, which is fine
  }
  authTokenCache = null;
}

export { appTest };
