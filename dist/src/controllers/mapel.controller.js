"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapel_service_1 = require("../service/mapel.service");
const logger_1 = __importDefault(require("../utils/logger"));
class MapelController {
    async create(req, res, next) {
        try {
            const { namaMapel, kategori } = req.body;
            const adminId = req.user?.adminId;
            if (!adminId) {
                throw new Error("Admin ID not found in request");
            }
            const result = await (0, mapel_service_1.createMapelService)({
                namaMapel,
                kategori,
                adminId,
            });
            res.status(201).send({
                success: true,
                message: "Mata pelajaran dan skema (kosong) berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error create mapel: ${error.message}`);
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { namaMapel, kategori } = req.body;
            const result = await (0, mapel_service_1.updateMapelService)(id, {
                namaMapel,
                kategori,
            });
            res.status(200).send({
                success: true,
                message: "Mata pelajaran berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error update mapel: ${error.message}`);
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await (0, mapel_service_1.deleteMapelService)(id);
            res.status(200).send({
                success: true,
                message: "Mata pelajaran berhasil dihapus",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error delete mapel: ${error.message}`);
            }
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const result = await (0, mapel_service_1.getAllMapelService)();
            res.status(200).send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = MapelController;
