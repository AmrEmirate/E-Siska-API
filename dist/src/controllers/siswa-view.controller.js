"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const siswa_view_service_1 = require("../service/siswa-view.service");
const logger_1 = __importDefault(require("../utils/logger"));
class SiswaViewController {
    async getMyAbsensi(req, res, next) {
        try {
            const siswaId = req.user?.siswaId;
            const tahunAjaranId = req.query.tahunAjaranId;
            if (!siswaId) {
                return res.status(403).send({
                    success: false,
                    message: "Siswa ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Siswa ${siswaId} fetching own attendance`);
            const result = await (0, siswa_view_service_1.getMyAbsensiService)(siswaId, tahunAjaranId);
            res.status(200).send({
                success: true,
                message: "Data absensi berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my absensi: ${error.message}`);
            }
            next(error);
        }
    }
    async getMyNilai(req, res, next) {
        try {
            const siswaId = req.user?.siswaId;
            const tahunAjaranId = req.query.tahunAjaranId;
            if (!siswaId) {
                return res.status(403).send({
                    success: false,
                    message: "Siswa ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Siswa ${siswaId} fetching own grades`);
            const result = await (0, siswa_view_service_1.getMyNilaiService)(siswaId, tahunAjaranId);
            res.status(200).send({
                success: true,
                message: "Data nilai berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my nilai: ${error.message}`);
            }
            next(error);
        }
    }
    async getMyJadwal(req, res, next) {
        try {
            const siswaId = req.user?.siswaId;
            if (!siswaId) {
                return res.status(403).send({
                    success: false,
                    message: "Siswa ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Siswa ${siswaId} fetching class schedule`);
            const result = await (0, siswa_view_service_1.getMyJadwalService)(siswaId);
            res.status(200).send({
                success: true,
                message: "Jadwal pelajaran berhasil diambil",
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
            logger_1.default.info("Fetching pengumuman for siswa");
            const result = await (0, siswa_view_service_1.getPengumumanService)();
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
            logger_1.default.info("Fetching dokumen for siswa");
            const result = await (0, siswa_view_service_1.getDokumenService)();
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
exports.default = SiswaViewController;
