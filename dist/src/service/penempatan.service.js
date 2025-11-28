"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePenempatanService = exports.updatePenempatanService = exports.getPenempatanByIdService = exports.getAllPenempatanService = exports.createPenempatanService = void 0;
const penempatan_repository_1 = require("../repositories/penempatan.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const createPenempatanService = async (data) => {
    logger_1.default.info(`Mencoba menempatkan siswa ${data.siswaId} ke kelas ${data.kelasId}`);
    const [siswa, kelas, tahunAjaran] = await Promise.all([
        prisma_1.prisma.siswa.findUnique({ where: { id: data.siswaId } }),
        prisma_1.prisma.kelas.findUnique({ where: { id: data.kelasId } }),
        prisma_1.prisma.tahunAjaran.findUnique({ where: { id: data.tahunAjaranId } }),
    ]);
    if (!siswa)
        throw new AppError_1.default("Siswa tidak ditemukan", 404);
    if (!kelas)
        throw new AppError_1.default("Kelas tidak ditemukan", 404);
    if (!tahunAjaran)
        throw new AppError_1.default("Tahun Ajaran tidak ditemukan", 404);
    const existingPenempatan = await (0, penempatan_repository_1.findPenempatanBySiswaAndTahun)(data.siswaId, data.tahunAjaranId);
    if (existingPenempatan) {
        throw new AppError_1.default(`Siswa ini sudah ditempatkan di kelas lain pada tahun ajaran ${tahunAjaran.nama}`, 409);
    }
    const newPenempatan = await (0, penempatan_repository_1.createPenempatanRepo)(data);
    return newPenempatan;
};
exports.createPenempatanService = createPenempatanService;
const getAllPenempatanService = async (filters) => {
    logger_1.default.info("Fetching all penempatan");
    const penempatan = await prisma_1.prisma.penempatanSiswa.findMany({
        where: {
            ...(filters?.tahunAjaranId && { tahunAjaranId: filters.tahunAjaranId }),
            ...(filters?.kelasId && { kelasId: filters.kelasId }),
            ...(filters?.siswaId && { siswaId: filters.siswaId }),
        },
        include: {
            siswa: true,
            kelas: {
                include: {
                    tingkatan: true,
                },
            },
            tahunAjaran: true,
        },
        orderBy: {
            siswa: {
                nama: "asc",
            },
        },
    });
    return penempatan;
};
exports.getAllPenempatanService = getAllPenempatanService;
const getPenempatanByIdService = async (id) => {
    logger_1.default.info(`Fetching penempatan: ${id}`);
    const penempatan = await prisma_1.prisma.penempatanSiswa.findUnique({
        where: { id },
        include: {
            siswa: true,
            kelas: {
                include: {
                    tingkatan: true,
                },
            },
            tahunAjaran: true,
        },
    });
    if (!penempatan) {
        throw new AppError_1.default("Penempatan tidak ditemukan", 404);
    }
    return penempatan;
};
exports.getPenempatanByIdService = getPenempatanByIdService;
const updatePenempatanService = async (id, data) => {
    logger_1.default.info(`Updating penempatan: ${id}`);
    const penempatan = await prisma_1.prisma.penempatanSiswa.findUnique({
        where: { id },
    });
    if (!penempatan) {
        throw new AppError_1.default("Penempatan tidak ditemukan", 404);
    }
    const updated = await prisma_1.prisma.penempatanSiswa.update({
        where: { id },
        data: {
            ...(data.siswaId && { siswaId: data.siswaId }),
            ...(data.kelasId && { kelasId: data.kelasId }),
            ...(data.tahunAjaranId && { tahunAjaranId: data.tahunAjaranId }),
        },
    });
    return updated;
};
exports.updatePenempatanService = updatePenempatanService;
const deletePenempatanService = async (id) => {
    logger_1.default.info(`Deleting penempatan: ${id}`);
    const penempatan = await prisma_1.prisma.penempatanSiswa.findUnique({
        where: { id },
    });
    if (!penempatan) {
        throw new AppError_1.default("Penempatan tidak ditemukan", 404);
    }
    await prisma_1.prisma.penempatanSiswa.delete({
        where: { id },
    });
    return { message: "Penempatan berhasil dihapus" };
};
exports.deletePenempatanService = deletePenempatanService;
