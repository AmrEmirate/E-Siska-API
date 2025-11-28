"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kelas_service_1 = require("../service/kelas.service");
const logger_1 = __importDefault(require("../utils/logger"));
class KelasController {
    async create(req, res, next) {
        try {
            const { namaKelas, tingkatanId, waliKelasId } = req.body;
            const result = await (0, kelas_service_1.createKelasService)({
                namaKelas,
                tingkatanId,
                waliKelasId,
            });
            res.status(201).send({
                success: true,
                message: "Kelas berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create kelas: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const result = await (0, kelas_service_1.getAllKelasService)();
            res.status(200).send({
                success: true,
                message: "Data kelas berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get all kelas: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { namaKelas, tingkatanId, waliKelasId } = req.body;
            const result = await (0, kelas_service_1.updateKelasService)(id, {
                namaKelas,
                tingkatanId,
                waliKelasId,
            });
            res.status(200).send({
                success: true,
                message: "Kelas berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update kelas: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await (0, kelas_service_1.deleteKelasService)(id);
            res.status(200).send({
                success: true,
                message: "Kelas berhasil dihapus",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete kelas: ${error.message}`);
            }
            next(error);
        }
    }
    async getMyClass(req, res, next) {
        try {
            const guruId = req.user?.id;
            if (!guruId) {
                throw new Error("User ID not found in request");
            }
            const result = await (0, kelas_service_1.getMyClassService)(guruId);
            res.status(200).send({
                success: true,
                message: "Data kelas wali kelas berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my class: ${error.message}`);
            }
            next(error);
        }
    }
    async getMyTeachingClasses(req, res, next) {
        try {
            const guruId = req.user?.id;
            if (!guruId) {
                throw new Error("User ID not found in request");
            }
            const result = await (0, kelas_service_1.getMyTeachingClassesService)(guruId);
            res.status(200).send({
                success: true,
                message: "Data kelas ajar berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error get my teaching classes: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = KelasController;
