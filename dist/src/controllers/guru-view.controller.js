"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guru_view_service_1 = require("../service/guru-view.service");
const logger_1 = __importDefault(require("../utils/logger"));
class GuruViewController {
    async getMyJadwal(req, res, next) {
        try {
            const guruId = req.user?.guruId;
            if (!guruId) {
                return res.status(403).send({
                    success: false,
                    message: "Guru ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Guru ${guruId} fetching own schedule`);
            const result = await (0, guru_view_service_1.getMyJadwalGuruService)(guruId);
            res.status(200).send({
                success: true,
                message: "Jadwal mengajar berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my jadwal: ${error.message}`);
            }
            next(error);
        }
    }
    async getPengumuman(req, res, next) {
        try {
            logger_1.default.info("Guru fetching pengumuman");
            const result = await (0, guru_view_service_1.getPengumumanGuruService)();
            res.status(200).send({
                success: true,
                message: "Pengumuman berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get pengumuman: ${error.message}`);
            }
            next(error);
        }
    }
    async getDokumen(req, res, next) {
        try {
            logger_1.default.info("Guru fetching dokumen");
            const result = await (0, guru_view_service_1.getDokumenGuruService)();
            res.status(200).send({
                success: true,
                message: "Daftar dokumen berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get dokumen: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = GuruViewController;
