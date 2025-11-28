"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const siswa_service_1 = require("../service/siswa.service");
const logger_1 = __importDefault(require("../utils/logger"));
class SiswaController {
    async create(req, res, next) {
        try {
            const dataSiswa = req.body;
            logger_1.default.info(`Mencoba membuat siswa baru dengan NIS: ${dataSiswa.nis}`);
            const result = await (0, siswa_service_1.createSiswaService)(dataSiswa);
            res.status(201).send({
                success: true,
                message: "Siswa dan Akun berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create siswa: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            logger_1.default.info(`Fetching all siswa - Page: ${page}, Limit: ${limit}`);
            const result = await (0, siswa_service_1.getAllSiswaService)(page, limit);
            res.status(200).send({
                success: true,
                message: "Data siswa berhasil diambil",
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all siswa: ${error.message}`);
            }
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            logger_1.default.info(`Fetching siswa by ID: ${id}`);
            const result = await (0, siswa_service_1.getSiswaByIdService)(id);
            res.status(200).send({
                success: true,
                message: "Data siswa berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get siswa by ID: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            logger_1.default.info(`Updating siswa: ${id}`);
            const result = await (0, siswa_service_1.updateSiswaService)(id, updateData);
            res.status(200).send({
                success: true,
                message: "Data siswa berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update siswa: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            logger_1.default.info(`Deleting siswa: ${id}`);
            const result = await (0, siswa_service_1.deleteSiswaService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete siswa: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = SiswaController;
