"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dokumen_service_1 = require("../service/dokumen.service");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class DokumenController {
    async create(req, res, next) {
        try {
            const { judul } = req.body;
            if (!req.file) {
                throw new AppError_1.default("File dokumen wajib diupload", 400);
            }
            const result = await (0, dokumen_service_1.createDokumenService)({
                judul,
                file: req.file,
            });
            res.status(201).send({
                success: true,
                message: "Dokumen berhasil diupload",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create dokumen: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await (0, dokumen_service_1.getAllDokumenService)(page, limit);
            res.status(200).send({
                success: true,
                message: "Daftar dokumen berhasil diambil",
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all dokumen: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, dokumen_service_1.deleteDokumenService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete dokumen: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = DokumenController;
