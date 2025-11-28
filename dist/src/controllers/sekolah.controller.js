"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sekolah_service_1 = require("../service/sekolah.service");
const logger_1 = __importDefault(require("../utils/logger"));
class SekolahController {
    async get(req, res, next) {
        try {
            const result = await (0, sekolah_service_1.getSekolahDataService)();
            res.status(200).send({
                success: true,
                message: "Data sekolah berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get sekolah data: ${error.message}`);
            }
            next(error);
        }
    }
    async upsert(req, res, next) {
        try {
            const adminId = req.user?.adminId;
            if (!adminId) {
                return res.status(403).send({
                    success: false,
                    message: "Admin ID tidak ditemukan",
                });
            }
            const { namaSekolah, alamat, kepalaSekolah } = req.body;
            const result = await (0, sekolah_service_1.upsertSekolahDataService)({
                namaSekolah,
                alamat,
                kepalaSekolah,
            }, adminId);
            res.status(200).send({
                success: true,
                message: "Data sekolah berhasil disimpan",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error upsert sekolah data: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const result = await (0, sekolah_service_1.deleteSekolahDataService)();
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete sekolah data: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = SekolahController;
