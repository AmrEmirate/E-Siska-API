"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rapor_service_1 = require("../service/rapor.service");
const logger_1 = __importDefault(require("../utils/logger"));
class RaporController {
    async updateDataRapor(req, res, next) {
        try {
            const { siswaId } = req.params;
            const { guruId, tahunAjaranId, catatan, kokurikuler } = req.body;
            const result = await (0, rapor_service_1.inputDataRaporService)({
                guruId,
                siswaId,
                tahunAjaranId,
                catatan,
                kokurikuler,
            });
            res.status(200).send({
                success: true,
                message: "Data rapor berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update rapor: ${error.message}`);
            }
            next(error);
        }
    }
    async generate(req, res, next) {
        try {
            const { siswaId } = req.params;
            const { guruId, tahunAjaranId } = req.body;
            const result = await (0, rapor_service_1.generateRaporService)({
                siswaId,
                guruId,
                tahunAjaranId,
            });
            res.status(200).send({
                success: true,
                message: "Data rapor berhasil di-generate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error generate rapor: ${error.message}`);
            }
            next(error);
        }
    }
    async finalize(req, res, next) {
        try {
            const { siswaId } = req.params;
            const { guruId, tahunAjaranId } = req.body;
            const result = await (0, rapor_service_1.finalizeRaporService)({
                guruId,
                siswaId,
                tahunAjaranId,
            });
            res.status(200).send({
                success: true,
                message: "Rapor berhasil difinalisasi",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error finalize rapor: ${error.message}`);
            }
            next(error);
        }
    }
    async definalize(req, res, next) {
        try {
            const { siswaId } = req.params;
            const { guruId, tahunAjaranId } = req.body;
            const result = await (0, rapor_service_1.definalizeRaporService)({
                guruId,
                siswaId,
                tahunAjaranId,
            });
            res.status(200).send({
                success: true,
                message: "Rapor berhasil didefinalisasi",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error definalize rapor: ${error.message}`);
            }
            next(error);
        }
    }
    async override(req, res, next) {
        try {
            const { siswaId } = req.params;
            const { adminId, mapelId, tahunAjaranId, nilaiAkhir } = req.body;
            const result = await (0, rapor_service_1.overrideNilaiRaporService)({
                adminId,
                siswaId,
                mapelId,
                tahunAjaranId,
                nilaiAkhir,
            });
            res.status(200).send({
                success: true,
                message: "Nilai rapor berhasil di-override",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error override nilai rapor: ${error.message}`);
            }
            next(error);
        }
    }
    async getMyRapor(req, res, next) {
        try {
            const siswaId = req.user?.siswaId;
            if (!siswaId) {
                throw new Error("Siswa ID not found in request");
            }
            const result = await (0, rapor_service_1.getMyRaporService)(siswaId);
            res.status(200).send({
                success: true,
                message: "Rapor berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my rapor: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = RaporController;
