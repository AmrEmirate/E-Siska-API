"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ruangan_service_1 = require("../service/ruangan.service");
const logger_1 = __importDefault(require("../utils/logger"));
class RuanganController {
    async create(req, res, next) {
        try {
            const { namaRuangan, kapasitas } = req.body;
            const adminId = req.user?.adminId;
            if (!adminId) {
                throw new Error("Admin ID not found in token");
            }
            const result = await (0, ruangan_service_1.createRuanganService)({
                namaRuangan,
                kapasitas,
                adminId,
            });
            res.status(201).send({
                success: true,
                message: "Ruangan berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create ruangan: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { namaRuangan, kapasitas } = req.body;
            const result = await (0, ruangan_service_1.updateRuanganService)(id, {
                namaRuangan,
                kapasitas,
            });
            res.status(200).send({
                success: true,
                message: "Ruangan berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update ruangan: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await (0, ruangan_service_1.deleteRuanganService)(id);
            res.status(200).send({
                success: true,
                message: "Ruangan berhasil dihapus",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete ruangan: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const result = await (0, ruangan_service_1.getAllRuanganService)();
            res.status(200).send({
                success: true,
                message: "Berhasil mengambil data ruangan",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all ruangan: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = RuanganController;
