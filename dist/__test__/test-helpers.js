"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appTest = exports.TEST_ADMIN_CREDENTIALS = void 0;
exports.setupTestUser = setupTestUser;
exports.getAuthToken = getAuthToken;
exports.authenticatedRequest = authenticatedRequest;
exports.cleanupTestUser = cleanupTestUser;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prisma_1 = require("../src/config/prisma");
const bcrypt = __importStar(require("bcrypt"));
const appTest = new app_1.default().app;
exports.appTest = appTest;
// Test user credentials
exports.TEST_ADMIN_CREDENTIALS = {
    username: "admin.test.main",
    password: "TestPassword123!",
};
let authTokenCache = null;
/**
 * Setup test admin user in database
 */
async function setupTestUser() {
    const hashedPassword = await bcrypt.hash(exports.TEST_ADMIN_CREDENTIALS.password, 10);
    try {
        await prisma_1.prisma.admin.upsert({
            where: { id: "test-admin-main-id" },
            update: {},
            create: {
                id: "test-admin-main-id",
                nama: "Test Admin",
                user: {
                    create: {
                        username: exports.TEST_ADMIN_CREDENTIALS.username,
                        passwordHash: hashedPassword,
                        role: "ADMIN",
                    },
                },
            },
        });
    }
    catch (error) {
        // User might already exist, which is fine
    }
}
/**
 * Helper function to get authentication token
 * @returns Promise<string> - JWT token
 */
async function getAuthToken(credentials = exports.TEST_ADMIN_CREDENTIALS) {
    // Return cached token if available
    if (authTokenCache && credentials === exports.TEST_ADMIN_CREDENTIALS) {
        return authTokenCache;
    }
    // Ensure test user exists
    await setupTestUser();
    const response = await (0, supertest_1.default)(appTest)
        .post("/api/auth/signin")
        .send(credentials);
    if (response.status !== 200) {
        throw new Error(`Failed to authenticate: ${JSON.stringify(response.body)}`);
    }
    const token = response.body.data.token;
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
function authenticatedRequest(method, path, token) {
    return (0, supertest_1.default)(appTest)[method](path).set("Authorization", `Bearer ${token}`);
}
/**
 * Cleanup test user
 */
async function cleanupTestUser() {
    try {
        await prisma_1.prisma.admin.delete({ where: { id: "test-admin-main-id" } });
        await prisma_1.prisma.user.delete({
            where: { username: exports.TEST_ADMIN_CREDENTIALS.username },
        });
    }
    catch (error) {
        // User might not exist, which is fine
    }
    authTokenCache = null;
}
