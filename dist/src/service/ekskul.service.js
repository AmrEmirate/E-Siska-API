"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputNilaiEkskulService = void 0;
const ekskul_repository_1 = require("../repositories/ekskul.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const prisma_2 = require("../generated/prisma");
const inputNilaiEkskulService = async (input) => {
    logger_1.default.info(`Mencoba input nilai ekskul untuk mapel ${input.mapelId}`);
    const mapel = await prisma_1.prisma.mataPelajaran.findUnique({
        where: { id: input.mapelId },
    });
    if (!mapel) {
        throw new AppError_1.default("Mata Pelajaran tidak ditemukan", 404);
    }
    if (mapel.kategori !== prisma_2.MapelCategory.EKSTRAKURIKULER) {
        throw new AppError_1.default(`Fitur ini khusus untuk kategori EKSTRAKURIKULER. Mapel ini adalah ${mapel.kategori}.`, 400);
    }
    const penugasan = await prisma_1.prisma.penugasanGuru.findFirst({
        where: {
            guruId: input.guruId,
            mapelId: input.mapelId,
        },
    });
    if (!penugasan) {
        throw new AppError_1.default("Anda tidak terdaftar sebagai pembina ekstrakurikuler ini.", 403);
    }
    const result = await (0, ekskul_repository_1.saveNilaiEkskulRepo)(input.guruId, input.mapelId, input.data);
    return result;
};
exports.inputNilaiEkskulService = inputNilaiEkskulService;
