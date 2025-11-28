"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJadwalService = exports.updateJadwalService = exports.getJadwalByIdService = exports.getAllJadwalService = exports.createJadwalService = void 0;
const jadwal_repository_1 = require("../repositories/jadwal.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const createJadwalService = async (data) => {
    try {
        logger_1.default.info(`Mencoba membuat jadwal baru...`);
        const penugasan = await prisma_1.prisma.penugasanGuru.findUnique({
            where: {
                guruId_mapelId_kelasId: {
                    guruId: data.guruId,
                    mapelId: data.mapelId,
                    kelasId: data.kelasId,
                },
            },
        });
        if (!penugasan) {
            throw new AppError_1.default("Penugasan Guru untuk Mapel dan Kelas ini tidak ditemukan. Harap buat penugasan terlebih dahulu.", 404);
        }
        const [tahunAjaran, ruangan] = await Promise.all([
            prisma_1.prisma.tahunAjaran.findUnique({ where: { id: data.tahunAjaranId } }),
            prisma_1.prisma.ruangan.findUnique({ where: { id: data.ruanganId } }),
        ]);
        if (!tahunAjaran)
            throw new AppError_1.default("Tahun Ajaran tidak ditemukan", 404);
        if (!ruangan)
            throw new AppError_1.default("Ruangan tidak ditemukan", 404);
        const newJadwal = await (0, jadwal_repository_1.createJadwalRepo)(data);
        return newJadwal;
    }
    catch (error) {
        logger_1.default.error(`Error in createJadwalService: ${error}`);
        throw error;
    }
};
exports.createJadwalService = createJadwalService;
const getAllJadwalService = async (filters) => {
    logger_1.default.info("Fetching all jadwal");
    const jadwal = await prisma_1.prisma.jadwal.findMany({
        where: {
            ...(filters?.tahunAjaranId && { tahunAjaranId: filters.tahunAjaranId }),
            ...(filters?.kelasId && { kelasId: filters.kelasId }),
            ...(filters?.guruId && { guruId: filters.guruId }),
        },
        include: {
            mapel: true,
            guru: true,
            kelas: {
                include: {
                    tingkatan: true,
                },
            },
            ruangan: true,
            tahunAjaran: true,
        },
        orderBy: [{ hari: "asc" }, { waktuMulai: "asc" }],
    });
    return jadwal;
};
exports.getAllJadwalService = getAllJadwalService;
const getJadwalByIdService = async (id) => {
    logger_1.default.info(`Fetching jadwal: ${id}`);
    const jadwal = await prisma_1.prisma.jadwal.findUnique({
        where: { id },
        include: {
            mapel: true,
            guru: true,
            kelas: {
                include: {
                    tingkatan: true,
                },
            },
            ruangan: true,
            tahunAjaran: true,
        },
    });
    if (!jadwal) {
        throw new AppError_1.default("Jadwal tidak ditemukan", 404);
    }
    return jadwal;
};
exports.getJadwalByIdService = getJadwalByIdService;
const updateJadwalService = async (id, data) => {
    logger_1.default.info(`Updating jadwal: ${id}`);
    const jadwal = await prisma_1.prisma.jadwal.findUnique({
        where: { id },
    });
    if (!jadwal) {
        throw new AppError_1.default("Jadwal tidak ditemukan", 404);
    }
    const updated = await prisma_1.prisma.jadwal.update({
        where: { id },
        data: {
            ...(data.tahunAjaranId && { tahunAjaranId: data.tahunAjaranId }),
            ...(data.kelasId && { kelasId: data.kelasId }),
            ...(data.mapelId && { mapelId: data.mapelId }),
            ...(data.guruId && { guruId: data.guruId }),
            ...(data.ruanganId && { ruanganId: data.ruanganId }),
            ...(data.hari && { hari: data.hari }),
            ...(data.waktuMulai && { waktuMulai: data.waktuMulai }),
            ...(data.waktuSelesai && { waktuSelesai: data.waktuSelesai }),
        },
    });
    return updated;
};
exports.updateJadwalService = updateJadwalService;
const deleteJadwalService = async (id) => {
    logger_1.default.info(`Deleting jadwal: ${id}`);
    const jadwal = await prisma_1.prisma.jadwal.findUnique({
        where: { id },
    });
    if (!jadwal) {
        throw new AppError_1.default("Jadwal tidak ditemukan", 404);
    }
    await prisma_1.prisma.jadwal.delete({
        where: { id },
    });
    return { message: "Jadwal berhasil dihapus" };
};
exports.deleteJadwalService = deleteJadwalService;
