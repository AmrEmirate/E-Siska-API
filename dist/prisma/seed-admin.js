"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../src/utils/logger"));
async function seedAdmin() {
    try {
        logger_1.default.info("Starting admin seed...");
        const existingAdmin = await prisma_1.prisma.user.findFirst({
            where: {
                role: "ADMIN",
            },
        });
        if (existingAdmin) {
            logger_1.default.warn("Admin user already exists. Skipping...");
            console.log("✅ Admin user already exists!");
            return;
        }
        const passwordHash = await bcrypt_1.default.hash("admin123", 10);
        const adminUser = await prisma_1.prisma.user.create({
            data: {
                username: "admin",
                passwordHash: passwordHash,
                role: "ADMIN",
            },
        });
        logger_1.default.info(`Admin user created: ${adminUser.id}`);
        const adminProfile = await prisma_1.prisma.admin.create({
            data: {
                userId: adminUser.id,
                nama: "Administrator",
            },
        });
        logger_1.default.info(`Admin profile created: ${adminProfile.id}`);
        console.log("\n✅ Admin account created successfully!");
        console.log("━".repeat(50));
        console.log("📝 Admin Credentials:");
        console.log("   Username: admin");
        console.log("   Password: admin123");
        console.log("━".repeat(50));
        console.log("\n⚠️  IMPORTANT: Change password after first login!");
        console.log("\n");
    }
    catch (error) {
        logger_1.default.error(`Error seeding admin: ${error}`);
        console.error("❌ Error creating admin:", error);
        throw error;
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
seedAdmin()
    .then(() => {
    console.log("✅ Seed completed!");
    process.exit(0);
})
    .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
});
