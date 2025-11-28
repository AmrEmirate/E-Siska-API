"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const capaian_service_1 = require("../service/capaian.service");
const logger_1 = __importDefault(require("../utils/logger"));
class CapaianController {
    async inputCapaian(req, res, next) {
        try {
            const { guruId, mapelId, data } = req.body;
            const result = await (0, capaian_service_1.inputCapaianService)({
                guruId,
                mapelId,
                data,
            });
            res.status(200).send({
                success: true,
                message: "Capaian kompetensi berhasil disimpan",
                totalData: result.length,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error input capaian: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = CapaianController;
