"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skema_service_1 = require("../service/skema.service");
const logger_1 = __importDefault(require("../utils/logger"));
class SkemaController {
    async addKomponen(req, res, next) {
        try {
            const { skemaId } = req.params;
            const { namaKomponen, tipe, formula, urutan } = req.body;
            const result = await (0, skema_service_1.addKomponenToSkemaService)({
                skemaId,
                namaKomponen,
                tipe,
                formula,
                urutan,
            });
            res.status(201).send({
                success: true,
                message: "Komponen nilai berhasil ditambahkan ke skema",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error add komponen ke skema ${req.params.skemaId}: ${error.message}`);
            }
            next(error);
        }
    }
    async getSkema(req, res, next) {
        try {
            const { mapelId } = req.params;
            const result = await (0, skema_service_1.getSkemaByMapelIdService)(mapelId);
            res.status(200).send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteKomponen(req, res, next) {
        try {
            const { komponenId } = req.params;
            const result = await (0, skema_service_1.deleteKomponenService)(komponenId);
            res.status(200).send({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = SkemaController;
