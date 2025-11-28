"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const absensi_service_1 = require("../service/absensi.service");
const logger_1 = __importDefault(require("../utils/logger"));
class AbsensiController {
    async createSesi(req, res, next) {
        try {
            const { guruId, kelasId, tanggal, pertemuanKe } = req.body;
            const result = await (0, absensi_service_1.createSesiService)({
                guruId,
                kelasId,
                tanggal,
                pertemuanKe,
            });
            res.status(201).send({
                success: true,
                message: "Sesi absensi berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create sesi absensi: ${error.message}`);
            }
            next(error);
        }
    }
    async getSesiByKelas(req, res, next) {
        try {
            const { kelasId } = req.params;
            const result = await (0, absensi_service_1.getSesiByKelasService)(kelasId);
            res.status(200).send({
                success: true,
                message: "Daftar sesi berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get sesi by kelas: ${error.message}`);
            }
            next(error);
        }
    }
    async getSesiDetail(req, res, next) {
        try {
            const { sesiId } = req.params;
            const result = await (0, absensi_service_1.getSesiDetailService)(sesiId);
            res.status(200).send({
                success: true,
                message: "Detail sesi berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get sesi detail: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = AbsensiController;
