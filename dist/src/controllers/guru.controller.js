"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guru_service_1 = require("../service/guru.service");
const logger_1 = __importDefault(require("../utils/logger"));
class GuruController {
    async create(req, res, next) {
        try {
            const dataGuru = req.body;
            logger_1.default.info(`Mencoba membuat guru baru dengan NIP: ${dataGuru.nip}`);
            const result = await (0, guru_service_1.createGuruService)(dataGuru);
            res.status(201).send({
                success: true,
                message: "Guru dan Akun berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create guru: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            logger_1.default.info(`Fetching all guru - Page: ${page}, Limit: ${limit}`);
            const result = await (0, guru_service_1.getAllGuruService)(page, limit);
            res.status(200).send({
                success: true,
                message: "Data guru berhasil diambil",
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all guru: ${error.message}`);
            }
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            logger_1.default.info(`Fetching guru by ID: ${id}`);
            const result = await (0, guru_service_1.getGuruByIdService)(id);
            res.status(200).send({
                success: true,
                message: "Data guru berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get guru by ID: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            logger_1.default.info(`Updating guru: ${id}`);
            const result = await (0, guru_service_1.updateGuruService)(id, updateData);
            res.status(200).send({
                success: true,
                message: "Data guru berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update guru: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            logger_1.default.info(`Deleting guru: ${id}`);
            const result = await (0, guru_service_1.deleteGuruService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete guru: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = GuruController;
