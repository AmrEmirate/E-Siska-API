"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const absensiDetail_service_1 = require("../service/absensiDetail.service");
const logger_1 = __importDefault(require("../utils/logger"));
class AbsensiDetailController {
    async inputAbsensi(req, res, next) {
        try {
            const { sesiId } = req.params;
            const { data } = req.body;
            const result = await (0, absensiDetail_service_1.inputAbsensiService)({
                sesiId,
                data,
            });
            res.status(200).send({
                success: true,
                message: "Detail absensi berhasil disimpan",
                totalData: result.length,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Error input absensi: ${error.message}`);
            }
            next(error);
        }
    }
}
exports.default = AbsensiDetailController;
