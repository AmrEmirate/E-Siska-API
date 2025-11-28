"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pengumuman_service_1 = require("../service/pengumuman.service");
const logger_1 = __importDefault(require("../utils/logger"));
class PengumumanController {
    async create(req, res, next) {
        try {
            const { judul, konten } = req.body;
            const { id: userId } = req.user;
            if (!userId) {
                throw new Error("User ID not found");
            }
            const result = await (0, pengumuman_service_1.createPengumumanService)({
                judul,
                konten,
                adminId: userId,
            });
            res.status(201).send({
                success: true,
                message: "Pengumuman berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create pengumuman: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await (0, pengumuman_service_1.getAllPengumumanService)(page, limit);
            res.status(200).send({
                success: true,
                message: "Daftar pengumuman berhasil diambil",
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all pengumuman: ${error.message}`);
            }
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, pengumuman_service_1.getPengumumanByIdService)(id);
            res.status(200).send({
                success: true,
                message: "Pengumuman berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get pengumuman by id: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { judul, konten } = req.body;
            const result = await (0, pengumuman_service_1.updatePengumumanService)(id, { judul, konten });
            res.status(200).send({
                success: true,
                message: "Pengumuman berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update pengumuman: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, pengumuman_service_1.deletePengumumanService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete pengumuman: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = PengumumanController;
