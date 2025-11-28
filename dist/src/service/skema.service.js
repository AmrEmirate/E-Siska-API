"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKomponenService = exports.getSkemaByMapelIdService = exports.addKomponenToSkemaService = void 0;
const skema_repository_1 = require("../repositories/skema.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const prisma_1 = require("../generated/prisma");
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_2 = require("../config/prisma");
const addKomponenToSkemaService = async (data) => {
    logger_1.default.info(`Mencoba menambah komponen ke skema: ${data.skemaId}`);
    const tipeKomponen = data.tipe;
    if (tipeKomponen === prisma_1.NilaiKomponenType.READ_ONLY && !data.formula) {
        throw new AppError_1.default("Komponen Tipe READ_ONLY wajib memiliki formula", 400);
    }
    if (tipeKomponen === prisma_1.NilaiKomponenType.INPUT && data.formula) {
        throw new AppError_1.default("Komponen Tipe INPUT tidak boleh memiliki formula", 400);
    }
    const skema = await prisma_2.prisma.skemaPenilaian.findUnique({
        where: { id: data.skemaId },
        include: { mapel: true },
    });
    if (!skema) {
        throw new AppError_1.default("Skema Penilaian tidak ditemukan", 404);
    }
    if (skema.mapel.kategori === prisma_1.MapelCategory.EKSTRAKURIKULER) {
        throw new AppError_1.default("Tidak dapat menambah komponen nilai ke mapel Ekstrakurikuler", 400);
    }
    const repoInput = {
        skemaId: data.skemaId,
        namaKomponen: data.namaKomponen,
        tipe: tipeKomponen,
        formula: data.formula,
        urutan: data.urutan,
    };
    const newKomponen = await (0, skema_repository_1.addKomponenToSkemaRepo)(repoInput);
    return newKomponen;
};
exports.addKomponenToSkemaService = addKomponenToSkemaService;
const getSkemaByMapelIdService = async (mapelId) => {
    logger_1.default.info(`Fetching skema penilaian untuk mapel: ${mapelId}`);
    const skema = await (0, skema_repository_1.getSkemaByMapelIdRepo)(mapelId);
    if (!skema) {
        throw new AppError_1.default("Skema penilaian belum dibuat untuk mapel ini", 404);
    }
    return skema;
};
exports.getSkemaByMapelIdService = getSkemaByMapelIdService;
const deleteKomponenService = async (komponenId) => {
    logger_1.default.info(`Menghapus komponen nilai: ${komponenId}`);
    const komponen = await prisma_2.prisma.nilaiKomponen.findUnique({
        where: { id: komponenId },
    });
    if (!komponen) {
        throw new AppError_1.default("Komponen tidak ditemukan", 404);
    }
    await (0, skema_repository_1.deleteKomponenRepo)(komponenId);
    return { message: "Komponen berhasil dihapus" };
};
exports.deleteKomponenService = deleteKomponenService;
