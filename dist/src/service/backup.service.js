"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBackupService = exports.restoreBackupService = exports.listBackupsService = exports.createBackupService = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const logger_1 = __importDefault(require("../utils/logger"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const createBackupService = async () => {
    logger_1.default.info("Creating database backup");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path_1.default.join(process.cwd(), "backups");
    const backupFile = path_1.default.join(backupDir, `backup-${timestamp}.sql`);
    if (!fs_1.default.existsSync(backupDir)) {
        fs_1.default.mkdirSync(backupDir, { recursive: true });
    }
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new AppError_1.default("DATABASE_URL tidak ditemukan di environment variables", 500);
    }
    try {
        const dbUrl = new URL(databaseUrl);
        const dbName = dbUrl.pathname.slice(1);
        const dbHost = dbUrl.hostname;
        const dbPort = dbUrl.port || "5432";
        const dbUser = dbUrl.username;
        const dbPassword = dbUrl.password;
        const pgDumpCommand = `PGPASSWORD="${dbPassword}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -F p -f "${backupFile}" ${dbName}`;
        logger_1.default.info(`Executing backup command for database: ${dbName}`);
        await execAsync(pgDumpCommand, {
            env: { ...process.env, PGPASSWORD: dbPassword },
        });
        logger_1.default.info(`Backup created successfully: ${backupFile}`);
        return {
            message: "Backup berhasil dibuat",
            filename: path_1.default.basename(backupFile),
            path: backupFile,
            timestamp: new Date(),
        };
    }
    catch (error) {
        logger_1.default.error(`Backup failed: ${error}`);
        throw new AppError_1.default("Gagal membuat backup database", 500);
    }
};
exports.createBackupService = createBackupService;
const listBackupsService = async () => {
    logger_1.default.info("Listing all backups");
    const backupDir = path_1.default.join(process.cwd(), "backups");
    if (!fs_1.default.existsSync(backupDir)) {
        return [];
    }
    const files = fs_1.default
        .readdirSync(backupDir)
        .filter((file) => file.endsWith(".sql"))
        .map((file) => {
        const filePath = path_1.default.join(backupDir, file);
        const stats = fs_1.default.statSync(filePath);
        return {
            filename: file,
            path: filePath,
            size: stats.size,
            createdAt: stats.birthtime,
        };
    })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return files;
};
exports.listBackupsService = listBackupsService;
const restoreBackupService = async (filename) => {
    logger_1.default.warn(`RESTORE REQUESTED for file: ${filename}`);
    const backupDir = path_1.default.join(process.cwd(), "backups");
    const backupFile = path_1.default.join(backupDir, filename);
    if (!fs_1.default.existsSync(backupFile)) {
        throw new AppError_1.default("File backup tidak ditemukan", 404);
    }
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new AppError_1.default("DATABASE_URL tidak ditemukan di environment variables", 500);
    }
    try {
        const dbUrl = new URL(databaseUrl);
        const dbName = dbUrl.pathname.slice(1);
        const dbHost = dbUrl.hostname;
        const dbPort = dbUrl.port || "5432";
        const dbUser = dbUrl.username;
        const dbPassword = dbUrl.password;
        const psqlCommand = `PGPASSWORD="${dbPassword}" psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f "${backupFile}"`;
        logger_1.default.warn(`Executing restore command - THIS WILL OVERWRITE DATABASE: ${dbName}`);
        await execAsync(psqlCommand, {
            env: { ...process.env, PGPASSWORD: dbPassword },
        });
        logger_1.default.info(`Database restored successfully from: ${backupFile}`);
        return {
            message: "Database berhasil di-restore",
            filename: filename,
            timestamp: new Date(),
        };
    }
    catch (error) {
        logger_1.default.error(`Restore failed: ${error}`);
        throw new AppError_1.default("Gagal restore database", 500);
    }
};
exports.restoreBackupService = restoreBackupService;
const deleteBackupService = async (filename) => {
    logger_1.default.info(`Deleting backup: ${filename}`);
    const backupDir = path_1.default.join(process.cwd(), "backups");
    const backupFile = path_1.default.join(backupDir, filename);
    if (!fs_1.default.existsSync(backupFile)) {
        throw new AppError_1.default("File backup tidak ditemukan", 404);
    }
    fs_1.default.unlinkSync(backupFile);
    logger_1.default.info(`Backup deleted: ${filename}`);
    return { message: "Backup berhasil dihapus" };
};
exports.deleteBackupService = deleteBackupService;
