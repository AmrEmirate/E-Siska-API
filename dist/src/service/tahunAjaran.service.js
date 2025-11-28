"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveTahunAjaranService = exports.deleteTahunAjaranService = exports.activateTahunAjaranService = exports.updateTahunAjaranService = exports.getTahunAjaranByIdService = exports.getAllTahunAjaranService = exports.createTahunAjaranService = void 0;
const prisma_1 = require("../config/prisma");
const tahunAjaran_repository_1 = require("../repositories/tahunAjaran.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const createTahunAjaranService = async (data) => {
    logger_1.default.info(`Creating tahun ajaran: ${data.nama}`);
    const ADMIN_ID_DUMMY = (await prisma_1.prisma.admin.findFirst())?.id || "dummy-admin-id";
    const newTahunAjaran = await (0, tahunAjaran_repository_1.createTahunAjaranRepo)({
        nama: data.nama,
        adminId: ADMIN_ID_DUMMY,
    });
    return newTahunAjaran;
};
exports.createTahunAjaranService = createTahunAjaranService;
const getAllTahunAjaranService = async () => {
    logger_1.default.info("Fetching all tahun ajaran");
    const tahunAjaran = await prisma_1.prisma.tahunAjaran.findMany({
        orderBy: {
            nama: "desc",
        },
    });
    return tahunAjaran.map((ta) => ({
        ...ta,
        isActive: ta.isAktif,
    }));
};
exports.getAllTahunAjaranService = getAllTahunAjaranService;
const getTahunAjaranByIdService = async (id) => {
    logger_1.default.info(`Fetching tahun ajaran: ${id}`);
    const tahunAjaran = await prisma_1.prisma.tahunAjaran.findUnique({
        where: { id },
    });
    if (!tahunAjaran) {
        throw new AppError_1.default("Tahun ajaran tidak ditemukan", 404);
    }
    return {
        ...tahunAjaran,
        isActive: tahunAjaran.isAktif,
    };
};
exports.getTahunAjaranByIdService = getTahunAjaranByIdService;
const updateTahunAjaranService = async (id, data) => {
    logger_1.default.info(`Updating tahun ajaran: ${id}`);
    const tahunAjaran = await prisma_1.prisma.tahunAjaran.findUnique({
        where: { id },
    });
    if (!tahunAjaran) {
        throw new AppError_1.default("Tahun ajaran tidak ditemukan", 404);
    }
    const updated = await prisma_1.prisma.tahunAjaran.update({
        where: { id },
        data: {
            ...(data.nama && { nama: data.nama }),
        },
    });
    return {
        ...updated,
        isActive: updated.isAktif,
    };
};
exports.updateTahunAjaranService = updateTahunAjaranService;
const activateTahunAjaranService = async (id) => {
    logger_1.default.info(`Activating tahun ajaran: ${id}`);
    const tahunAjaran = await prisma_1.prisma.tahunAjaran.findUnique({
        where: { id },
    });
    if (!tahunAjaran) {
        throw new AppError_1.default("Tahun ajaran tidak ditemukan", 404);
    }
    await prisma_1.prisma.tahunAjaran.updateMany({
        data: { isAktif: false },
    });
    const activated = await prisma_1.prisma.tahunAjaran.update({
        where: { id },
        data: { isAktif: true },
    });
    return {
        ...activated,
        isActive: activated.isAktif,
    };
};
exports.activateTahunAjaranService = activateTahunAjaranService;
const deleteTahunAjaranService = async (id) => {
    logger_1.default.info(`Deleting tahun ajaran: ${id}`);
    const tahunAjaran = await prisma_1.prisma.tahunAjaran.findUnique({
        where: { id },
    });
    if (!tahunAjaran) {
        throw new AppError_1.default("Tahun ajaran tidak ditemukan", 404);
    }
    if (tahunAjaran.isAktif) {
        throw new AppError_1.default("Tidak dapat menghapus tahun ajaran yang sedang aktif", 400);
    }
    await prisma_1.prisma.tahunAjaran.delete({
        where: { id },
    });
    return { message: "Tahun ajaran berhasil dihapus" };
};
exports.deleteTahunAjaranService = deleteTahunAjaranService;
const getActiveTahunAjaranService = async () => {
    logger_1.default.info("Fetching active tahun ajaran");
    const active = await prisma_1.prisma.tahunAjaran.findFirst({
        where: { isAktif: true },
    });
    if (!active) {
        throw new AppError_1.default("Tidak ada tahun ajaran yang aktif saat ini.", 404);
    }
    return {
        ...active,
        isActive: active.isAktif,
    };
};
exports.getActiveTahunAjaranService = getActiveTahunAjaranService;
