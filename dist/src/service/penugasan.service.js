"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePenugasanService = exports.updatePenugasanService = exports.getPenugasanByIdService = exports.getAllPenugasanService = exports.createPenugasanService = void 0;
const penugasan_repository_1 = require("../repositories/penugasan.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const createPenugasanService = async (data) => {
    logger_1.default.info(`Mencoba membuat penugasan baru...`);
    const [guru, mapel, kelas] = await Promise.all([
        prisma_1.prisma.guru.findUnique({ where: { id: data.guruId } }),
        prisma_1.prisma.mataPelajaran.findUnique({ where: { id: data.mapelId } }),
        prisma_1.prisma.kelas.findUnique({ where: { id: data.kelasId } }),
    ]);
    if (!guru)
        throw new AppError_1.default("Guru tidak ditemukan", 404);
    if (!mapel)
        throw new AppError_1.default("Mata Pelajaran tidak ditemukan", 404);
    if (!kelas)
        throw new AppError_1.default("Kelas tidak ditemukan", 404);
    const existingPenugasan = await (0, penugasan_repository_1.findPenugasanUnik)(data.guruId, data.mapelId, data.kelasId);
    if (existingPenugasan) {
        throw new AppError_1.default(`Guru ${guru.nama} sudah ditugaskan untuk mapel ${mapel.namaMapel} di kelas ${kelas.namaKelas}`, 409);
    }
    const newPenugasan = await (0, penugasan_repository_1.createPenugasanRepo)(data);
    return newPenugasan;
};
exports.createPenugasanService = createPenugasanService;
const getAllPenugasanService = async (filters) => {
    logger_1.default.info("Fetching all penugasan");
    const penugasan = await prisma_1.prisma.penugasanGuru.findMany({
        where: {
            ...(filters?.guruId && { guruId: filters.guruId }),
            ...(filters?.mapelId && { mapelId: filters.mapelId }),
            ...(filters?.kelasId && { kelasId: filters.kelasId }),
        },
        include: {
            guru: true,
            mapel: true,
            kelas: {
                include: {
                    tingkatan: true,
                },
            },
        },
        orderBy: {
            guru: {
                nama: "asc",
            },
        },
    });
    return penugasan;
};
exports.getAllPenugasanService = getAllPenugasanService;
const getPenugasanByIdService = async (id) => {
    logger_1.default.info(`Fetching penugasan: ${id}`);
    const penugasan = await prisma_1.prisma.penugasanGuru.findUnique({
        where: { id },
        include: {
            guru: true,
            mapel: true,
            kelas: {
                include: {
                    tingkatan: true,
                },
            },
        },
    });
    if (!penugasan) {
        throw new AppError_1.default("Penugasan tidak ditemukan", 404);
    }
    return penugasan;
};
exports.getPenugasanByIdService = getPenugasanByIdService;
const updatePenugasanService = async (id, data) => {
    logger_1.default.info(`Updating penugasan: ${id}`);
    const penugasan = await prisma_1.prisma.penugasanGuru.findUnique({
        where: { id },
    });
    if (!penugasan) {
        throw new AppError_1.default("Penugasan tidak ditemukan", 404);
    }
    const updated = await prisma_1.prisma.penugasanGuru.update({
        where: { id },
        data: {
            ...(data.guruId && { guruId: data.guruId }),
            ...(data.mapelId && { mapelId: data.mapelId }),
            ...(data.kelasId && { kelasId: data.kelasId }),
        },
    });
    return updated;
};
exports.updatePenugasanService = updatePenugasanService;
const deletePenugasanService = async (id) => {
    logger_1.default.info(`Deleting penugasan: ${id}`);
    const penugasan = await prisma_1.prisma.penugasanGuru.findUnique({
        where: { id },
    });
    if (!penugasan) {
        throw new AppError_1.default("Penugasan tidak ditemukan", 404);
    }
    await prisma_1.prisma.penugasanGuru.delete({
        where: { id },
    });
    return { message: "Penugasan berhasil dihapus" };
};
exports.deletePenugasanService = deletePenugasanService;
