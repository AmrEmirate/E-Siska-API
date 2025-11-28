"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSekolahDataService = exports.upsertSekolahDataService = exports.getSekolahDataService = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = __importDefault(require("../utils/AppError"));
const logger_1 = __importDefault(require("../utils/logger"));
const getSekolahDataService = async () => {
    logger_1.default.info("Fetching school data");
    const sekolah = await prisma_1.prisma.sekolahData.findFirst();
    if (!sekolah) {
        throw new AppError_1.default("Data sekolah belum diatur", 404);
    }
    return sekolah;
};
exports.getSekolahDataService = getSekolahDataService;
const upsertSekolahDataService = async (data, adminId) => {
    logger_1.default.info("Upserting school data");
    const existing = await prisma_1.prisma.sekolahData.findFirst();
    if (existing) {
        const updated = await prisma_1.prisma.sekolahData.update({
            where: { id: existing.id },
            data: {
                namaSekolah: data.namaSekolah,
                alamat: data.alamat,
                kepalaSekolah: data.kepalaSekolah,
            },
        });
        logger_1.default.info(`School data updated: ${updated.id}`);
        return updated;
    }
    else {
        const newSekolah = await prisma_1.prisma.sekolahData.create({
            data: {
                adminId: adminId,
                namaSekolah: data.namaSekolah,
                alamat: data.alamat,
                kepalaSekolah: data.kepalaSekolah,
            },
        });
        logger_1.default.info(`School data created: ${newSekolah.id}`);
        return newSekolah;
    }
};
exports.upsertSekolahDataService = upsertSekolahDataService;
const deleteSekolahDataService = async () => {
    logger_1.default.info("Deleting school data");
    const existing = await prisma_1.prisma.sekolahData.findFirst();
    if (!existing) {
        throw new AppError_1.default("Data sekolah tidak ditemukan", 404);
    }
    await prisma_1.prisma.sekolahData.delete({
        where: { id: existing.id },
    });
    return { message: "Data sekolah berhasil dihapus" };
};
exports.deleteSekolahDataService = deleteSekolahDataService;
