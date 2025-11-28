"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputAbsensiService = void 0;
const absensiDetail_repository_1 = require("../repositories/absensiDetail.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const prisma_2 = require("../generated/prisma");
const inputAbsensiService = async (input) => {
    logger_1.default.info(`Mencoba input detail absensi untuk sesi ${input.sesiId}`);
    const sesi = await prisma_1.prisma.absensiSesi.findUnique({
        where: { id: input.sesiId },
    });
    if (!sesi) {
        throw new AppError_1.default("Sesi absensi tidak ditemukan", 404);
    }
    const formattedData = input.data.map((item) => {
        if (!Object.values(prisma_2.AbsensiStatus).includes(item.status)) {
            throw new AppError_1.default(`Status absensi tidak valid untuk siswa ${item.siswaId}`, 400);
        }
        return {
            siswaId: item.siswaId,
            status: item.status,
        };
    });
    const result = await (0, absensiDetail_repository_1.upsertAbsensiDetailRepo)(input.sesiId, formattedData);
    return result;
};
exports.inputAbsensiService = inputAbsensiService;
