"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tingkatan_service_1 = require("../service/tingkatan.service");
const logger_1 = __importDefault(require("../utils/logger"));
class TingkatanController {
    async create(req, res, next) {
        try {
            const { namaTingkat } = req.body;
            const result = await (0, tingkatan_service_1.createTingkatanService)(namaTingkat);
            res.status(201).send({
                success: true,
                message: "Tingkatan kelas berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create tingkatan: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const result = await (0, tingkatan_service_1.getAllTingkatanService)();
            res.status(200).send({
                success: true,
                message: "Daftar tingkatan berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all tingkatan: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { namaTingkat } = req.body;
            const result = await (0, tingkatan_service_1.updateTingkatanService)(id, namaTingkat);
            res.status(200).send({
                success: true,
                message: "Tingkatan berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update tingkatan: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, tingkatan_service_1.deleteTingkatanService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete tingkatan: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = TingkatanController;
