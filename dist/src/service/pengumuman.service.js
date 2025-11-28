"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePengumumanService = exports.updatePengumumanService = exports.getPengumumanByIdService = exports.getAllPengumumanService = exports.createPengumumanService = void 0;
const prisma_1 = require("../config/prisma");
const pengumuman_repository_1 = require("../repositories/pengumuman.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const createPengumumanService = async (data) => {
    logger_1.default.info(`Mencoba membuat pengumuman: ${data.judul}`);
    const repoInput = {
        judul: data.judul,
        konten: data.konten,
        adminId: data.adminId,
    };
    const newPengumuman = await (0, pengumuman_repository_1.createPengumumanRepo)(repoInput);
    return newPengumuman;
};
exports.createPengumumanService = createPengumumanService;
const getAllPengumumanService = async (page = 1, limit = 50) => {
    const skip = (page - 1) * limit;
    const take = limit;
    logger_1.default.info(`Fetching all pengumuman - Page: ${page}, Limit: ${limit}`);
    const pengumuman = await prisma_1.prisma.pengumuman.findMany({
        skip,
        take,
        orderBy: {
            tanggalPublikasi: "desc",
        },
        select: {
            id: true,
            judul: true,
            konten: true,
            tanggalPublikasi: true,
        },
    });
    const total = await prisma_1.prisma.pengumuman.count();
    return {
        data: pengumuman,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getAllPengumumanService = getAllPengumumanService;
const getPengumumanByIdService = async (id) => {
    logger_1.default.info(`Fetching pengumuman: ${id}`);
    const pengumuman = await prisma_1.prisma.pengumuman.findUnique({
        where: { id },
        select: {
            id: true,
            judul: true,
            konten: true,
            tanggalPublikasi: true,
        },
    });
    if (!pengumuman) {
        throw new AppError_1.default("Pengumuman tidak ditemukan", 404);
    }
    return pengumuman;
};
exports.getPengumumanByIdService = getPengumumanByIdService;
const updatePengumumanService = async (id, data) => {
    logger_1.default.info(`Updating pengumuman: ${id}`);
    const pengumuman = await prisma_1.prisma.pengumuman.findUnique({
        where: { id },
    });
    if (!pengumuman) {
        throw new AppError_1.default("Pengumuman tidak ditemukan", 404);
    }
    const updated = await prisma_1.prisma.pengumuman.update({
        where: { id },
        data: {
            ...(data.judul && { judul: data.judul }),
            ...(data.konten && { konten: data.konten }),
        },
    });
    return updated;
};
exports.updatePengumumanService = updatePengumumanService;
const deletePengumumanService = async (id) => {
    logger_1.default.info(`Deleting pengumuman: ${id}`);
    const pengumuman = await prisma_1.prisma.pengumuman.findUnique({
        where: { id },
    });
    if (!pengumuman) {
        throw new AppError_1.default("Pengumuman tidak ditemukan", 404);
    }
    await prisma_1.prisma.pengumuman.delete({
        where: { id },
    });
    return { message: "Pengumuman berhasil dihapus" };
};
exports.deletePengumumanService = deletePengumumanService;
