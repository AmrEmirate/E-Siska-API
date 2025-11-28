"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputCapaianService = void 0;
const capaian_repository_1 = require("../repositories/capaian.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const prisma_2 = require("../generated/prisma");
const inputCapaianService = async (input) => {
    logger_1.default.info(`Mencoba input capaian kompetensi untuk mapel ${input.mapelId}`);
    const mapel = await prisma_1.prisma.mataPelajaran.findUnique({
        where: { id: input.mapelId },
    });
    if (!mapel) {
        throw new AppError_1.default("Mata Pelajaran tidak ditemukan", 404);
    }
    if (mapel.kategori === prisma_2.MapelCategory.EKSTRAKURIKULER) {
        throw new AppError_1.default("Ekstrakurikuler menggunakan menu input nilai tersendiri, bukan Capaian Kompetensi.", 400);
    }
    const penugasan = await prisma_1.prisma.penugasanGuru.findFirst({
        where: {
            guruId: input.guruId,
            mapelId: input.mapelId,
        },
    });
    if (!penugasan) {
        throw new AppError_1.default("Anda tidak terdaftar sebagai pengajar mata pelajaran ini.", 403);
    }
    const result = await (0, capaian_repository_1.upsertCapaianRepo)(input.guruId, input.mapelId, input.data);
    return result;
};
exports.inputCapaianService = inputCapaianService;
