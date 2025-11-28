"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wali_kelas_service_1 = require("../service/wali-kelas.service");
const logger_1 = __importDefault(require("../utils/logger"));
class WaliKelasController {
    async getRekapNilai(req, res, next) {
        try {
            const guruId = req.user?.guruId;
            const { kelasId } = req.params;
            if (!guruId) {
                return res.status(403).send({
                    success: false,
                    message: "Guru ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Wali kelas ${guruId} fetching rekap nilai for kelas ${kelasId}`);
            const result = await (0, wali_kelas_service_1.getRekapNilaiKelasService)(guruId, kelasId);
            res.status(200).send({
                success: true,
                message: "Rekap nilai kelas berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get rekap nilai: ${error.message}`);
            }
            next(error);
        }
    }
    async getRekapAbsensi(req, res, next) {
        try {
            const guruId = req.user?.guruId;
            const { kelasId } = req.params;
            if (!guruId) {
                return res.status(403).send({
                    success: false,
                    message: "Guru ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Wali kelas ${guruId} fetching rekap absensi for kelas ${kelasId}`);
            const result = await (0, wali_kelas_service_1.getRekapAbsensiKelasService)(guruId, kelasId);
            res.status(200).send({
                success: true,
                message: "Rekap absensi kelas berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get rekap absensi: ${error.message}`);
            }
            next(error);
        }
    }
    async getDataSiswa(req, res, next) {
        try {
            const guruId = req.user?.guruId;
            const { kelasId } = req.params;
            if (!guruId) {
                return res.status(403).send({
                    success: false,
                    message: "Guru ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Wali kelas ${guruId} fetching data siswa for kelas ${kelasId}`);
            const result = await (0, wali_kelas_service_1.getDataSiswaBimbinganService)(guruId, kelasId);
            res.status(200).send({
                success: true,
                message: "Data siswa berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get data siswa: ${error.message}`);
            }
            next(error);
        }
    }
    async getMyKelas(req, res, next) {
        try {
            const guruId = req.user?.guruId;
            if (!guruId) {
                return res.status(403).send({
                    success: false,
                    message: "Guru ID tidak ditemukan",
                });
            }
            logger_1.default.info(`Wali kelas ${guruId} fetching own kelas`);
            const result = await (0, wali_kelas_service_1.getMyKelasService)(guruId);
            res.status(200).send({
                success: true,
                message: "Data kelas berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my kelas: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = WaliKelasController;
