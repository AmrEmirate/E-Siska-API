"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tahunAjaran_service_1 = require("../service/tahunAjaran.service");
const logger_1 = __importDefault(require("../utils/logger"));
class TahunAjaranController {
    async create(req, res, next) {
        try {
            const { nama } = req.body;
            const result = await (0, tahunAjaran_service_1.createTahunAjaranService)({ nama });
            res.status(201).send({
                success: true,
                message: "Tahun ajaran berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create tahun ajaran: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const result = await (0, tahunAjaran_service_1.getAllTahunAjaranService)();
            res.status(200).send({
                success: true,
                message: "Daftar tahun ajaran berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all tahun ajaran: ${error.message}`);
            }
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, tahunAjaran_service_1.getTahunAjaranByIdService)(id);
            res.status(200).send({
                success: true,
                message: "Tahun ajaran berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get tahun ajaran by id: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { nama } = req.body;
            const result = await (0, tahunAjaran_service_1.updateTahunAjaranService)(id, { nama });
            res.status(200).send({
                success: true,
                message: "Tahun ajaran berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update tahun ajaran: ${error.message}`);
            }
            next(error);
        }
    }
    async activate(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, tahunAjaran_service_1.activateTahunAjaranService)(id);
            res.status(200).send({
                success: true,
                message: "Tahun ajaran berhasil diaktifkan",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error activate tahun ajaran: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, tahunAjaran_service_1.deleteTahunAjaranService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete tahun ajaran: ${error.message}`);
            }
            next(error);
        }
    }
    async getActive(req, res, next) {
        try {
            const result = await (0, tahunAjaran_service_1.getActiveTahunAjaranService)();
            res.status(200).send({
                success: true,
                message: "Tahun ajaran aktif berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get active tahun ajaran: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = TahunAjaranController;
