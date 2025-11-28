"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const penempatan_service_1 = require("../service/penempatan.service");
const logger_1 = __importDefault(require("../utils/logger"));
class PenempatanController {
    async create(req, res, next) {
        try {
            const { siswaId, kelasId, tahunAjaranId } = req.body;
            const result = await (0, penempatan_service_1.createPenempatanService)({
                siswaId,
                kelasId,
                tahunAjaranId,
            });
            res.status(201).send({
                success: true,
                message: "Penempatan siswa berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create penempatan: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { tahunAjaranId, kelasId, siswaId } = req.query;
            const result = await (0, penempatan_service_1.getAllPenempatanService)({
                tahunAjaranId: tahunAjaranId,
                kelasId: kelasId,
                siswaId: siswaId,
            });
            res.status(200).send({
                success: true,
                message: "Daftar penempatan berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all penempatan: ${error.message}`);
            }
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, penempatan_service_1.getPenempatanByIdService)(id);
            res.status(200).send({
                success: true,
                message: "Penempatan berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get penempatan by id: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await (0, penempatan_service_1.updatePenempatanService)(id, data);
            res.status(200).send({
                success: true,
                message: "Penempatan berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update penempatan: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, penempatan_service_1.deletePenempatanService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete penempatan: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = PenempatanController;
