"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ekskul_service_1 = require("../service/ekskul.service");
const logger_1 = __importDefault(require("../utils/logger"));
class EkskulController {
    async inputNilai(req, res, next) {
        try {
            const { guruId, mapelId, data } = req.body;
            const result = await (0, ekskul_service_1.inputNilaiEkskulService)({
                guruId,
                mapelId,
                data,
            });
            res.status(200).send({
                success: true,
                message: "Nilai ekstrakurikuler berhasil disimpan",
                totalData: result.length,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error input ekskul: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = EkskulController;
