"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const penugasan_service_1 = require("../service/penugasan.service");
const logger_1 = __importDefault(require("../utils/logger"));
class PenugasanController {
    async create(req, res, next) {
        try {
            const { guruId, mapelId, kelasId } = req.body;
            const result = await (0, penugasan_service_1.createPenugasanService)({
                guruId,
                mapelId,
                kelasId,
            });
            res.status(201).send({
                success: true,
                message: "Penugasan guru berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create penugasan: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const { guruId, mapelId, kelasId } = req.query;
            const result = await (0, penugasan_service_1.getAllPenugasanService)({
                guruId: guruId,
                mapelId: mapelId,
                kelasId: kelasId,
            });
            res.status(200).send({
                success: true,
                message: "Daftar penugasan berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all penugasan: ${error.message}`);
            }
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, penugasan_service_1.getPenugasanByIdService)(id);
            res.status(200).send({
                success: true,
                message: "Penugasan berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get penugasan by id: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await (0, penugasan_service_1.updatePenugasanService)(id, data);
            res.status(200).send({
                success: true,
                message: "Penugasan berhasil diupdate",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update penugasan: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await (0, penugasan_service_1.deletePenugasanService)(id);
            res.status(200).send({
                success: true,
                ...result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete penugasan: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = PenugasanController;
