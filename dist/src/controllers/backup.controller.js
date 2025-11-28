"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backup_service_1 = require("../service/backup.service");
const logger_1 = __importDefault(require("../utils/logger"));
class BackupController {
    async create(req, res, next) {
        try {
            logger_1.default.info("Admin requesting database backup");
            const result = await (0, backup_service_1.createBackupService)();
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error creating backup: ${error.message}`);
            }
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const result = await (0, backup_service_1.listBackupsService)();
            res.status(200).send({
                success: true,
                message: "Daftar backup berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error listing backups: ${error.message}`);
            }
            next(error);
        }
    }
    async restore(req, res, next) {
        try {
            const { filename } = req.body;
            if (!filename) {
                return res.status(400).send({
                    success: false,
                    message: "Filename harus disertakan",
                });
            }
            logger_1.default.warn(`Admin requesting database restore from: ${filename}`);
            const result = await (0, backup_service_1.restoreBackupService)(filename);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error restoring backup: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { filename } = req.params;
            const result = await (0, backup_service_1.deleteBackupService)(filename);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error deleting backup: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = BackupController;
