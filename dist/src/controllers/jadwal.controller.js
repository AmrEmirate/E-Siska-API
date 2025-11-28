"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jadwal_service_1 = require("../service/jadwal.service");
const logger_1 = __importDefault(require("../utils/logger"));
class JadwalController {
    async create(req, res, next) {
        try {
            const data = req.body;
            const result = await (0, jadwal_service_1.createJadwalService)({
                tahunAjaranId: data.tahunAjaranId,
                kelasId: data.kelasId,
                mapelId: data.mapelId,
                guruId: data.guruId,
                ruanganId: data.ruanganId,
                hari: data.hari,
                waktuMulai: data.waktuMulai,
                waktuSelesai: data.waktuSelesai,
            });
            res.status(201).send({
                success: true,
                message: "Jadwal berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create jadwal: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { tahunAjaranId, kelasId, guruId } = req.query;
            const result = await (0, jadwal_service_1.getAllJadwalService)({
                tahunAjaranId: tahunAjaranId,
                kelasId: kelasId,
                guruId: guruId,
            });
            res.status(200).send({
                success: true,
                message: "Daftar jadwal berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all jadwal: ${error.message}`);
            }
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, jadwal_service_1.getJadwalByIdService)(id);
            res.status(200).send({
                success: true,
                message: "Jadwal berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get jadwal by id: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await (0, jadwal_service_1.updateJadwalService)(id, data);
            res.status(200).send({
                success: true,
                message: "Jadwal berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update jadwal: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, jadwal_service_1.deleteJadwalService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete jadwal: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = JadwalController;
