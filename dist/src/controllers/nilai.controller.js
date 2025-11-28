"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nilai_service_1 = require("../service/nilai.service");
const logger_1 = __importDefault(require("../utils/logger"));
class NilaiController {
    async inputNilai(req, res, next) {
        try {
            const { guruId, mapelId, komponenId, data } = req.body;
            const result = await (0, nilai_service_1.inputNilaiService)({
                guruId,
                mapelId,
                komponenId,
                data,
            });
            res.status(200).send({
                success: true,
                message: "Nilai berhasil disimpan",
                totalData: result.length,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error input nilai: ${error.message}`);
            }
            next(error);
        }
    }
    async getNilaiKelas(req, res, next) {
        try {
            const { kelasId, mapelId } = req.params;
            const guruId = req.user?.id || "";
            const result = await (0, nilai_service_1.getNilaiKelasService)(guruId, kelasId, mapelId);
            res.status(200).send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getMyGrades(req, res, next) {
        try {
            const siswaId = req.user?.siswaId;
            if (!siswaId) {
                throw new Error("Siswa ID not found in request");
            }
            const result = await (0, nilai_service_1.getMyGradesService)(siswaId);
            res.status(200).send({
                success: true,
                message: "Nilai berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my grades: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { siswaId, mapelId, tahunAjaranId } = req.query;
            const result = await (0, nilai_service_1.getAllNilaiService)({
                siswaId: siswaId,
                mapelId: mapelId,
                tahunAjaranId: tahunAjaranId,
            });
            res.status(200).send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { nilai } = req.body;
            const guruId = req.user?.id || "";
            const result = await (0, nilai_service_1.updateNilaiService)(id, nilai, guruId);
            res.status(200).send({
                success: true,
                message: "Nilai berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await (0, nilai_service_1.deleteNilaiService)(id);
            res.status(200).send({
                success: true,
                message: "Nilai berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = NilaiController;
