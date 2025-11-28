"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTingkatanService = exports.updateTingkatanService = exports.getAllTingkatanService = exports.createTingkatanService = void 0;
const prisma_1 = require("../config/prisma");
const tingkatan_repository_1 = require("../repositories/tingkatan.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const createTingkatanService = async (namaTingkat) => {
    logger_1.default.info(`Mencoba membuat tingkatan kelas: ${namaTingkat}`);
    const newTingkatan = await (0, tingkatan_repository_1.createTingkatanRepo)(namaTingkat);
    return newTingkatan;
};
exports.createTingkatanService = createTingkatanService;
const getAllTingkatanService = async () => {
    logger_1.default.info("Fetching all tingkatan");
    const tingkatan = await prisma_1.prisma.tingkatanKelas.findMany({
        orderBy: {
            namaTingkat: "asc",
        },
    });
    return tingkatan;
};
exports.getAllTingkatanService = getAllTingkatanService;
const updateTingkatanService = async (id, namaTingkat) => {
    logger_1.default.info(`Updating tingkatan: ${id}`);
    const tingkatan = await prisma_1.prisma.tingkatanKelas.findUnique({
        where: { id },
    });
    if (!tingkatan) {
        throw new AppError_1.default("Tingkatan tidak ditemukan", 404);
    }
    const updated = await prisma_1.prisma.tingkatanKelas.update({
        where: { id },
        data: { namaTingkat },
    });
    return updated;
};
exports.updateTingkatanService = updateTingkatanService;
const deleteTingkatanService = async (id) => {
    logger_1.default.info(`Deleting tingkatan: ${id}`);
    const tingkatan = await prisma_1.prisma.tingkatanKelas.findUnique({
        where: { id },
        include: {
            Kelas: true,
        },
    });
    if (!tingkatan) {
        throw new AppError_1.default("Tingkatan tidak ditemukan", 404);
    }
    if (tingkatan.Kelas && tingkatan.Kelas.length > 0) {
        throw new AppError_1.default("Tidak dapat menghapus tingkatan yang masih digunakan oleh kelas", 400);
    }
    await prisma_1.prisma.tingkatanKelas.delete({
        where: { id },
    });
    return { message: "Tingkatan berhasil dihapus" };
};
exports.deleteTingkatanService = deleteTingkatanService;
