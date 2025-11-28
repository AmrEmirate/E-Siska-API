"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDokumenGuruService = exports.getPengumumanGuruService = exports.getMyJadwalGuruService = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
const getMyJadwalGuruService = async (guruId) => {
    logger_1.default.info(`Fetching schedule for guru: ${guruId}`);
    const jadwal = await prisma_1.prisma.jadwal.findMany({
        where: {
            guruId: guruId,
        },
        include: {
            mapel: true,
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
exports.getMyJadwalGuruService = getMyJadwalGuruService;
const getPengumumanGuruService = async () => {
    logger_1.default.info("Fetching pengumuman for guru");
    const pengumuman = await prisma_1.prisma.pengumuman.findMany({
        orderBy: {
            tanggalPublikasi: "desc",
        },
        take: 50,
    });
    return pengumuman;
};
exports.getPengumumanGuruService = getPengumumanGuruService;
const getDokumenGuruService = async () => {
    logger_1.default.info("Fetching dokumen for guru");
    const dokumen = await prisma_1.prisma.dokumen.findMany({
        select: {
            id: true,
            judul: true,
            urlFile: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return dokumen;
};
exports.getDokumenGuruService = getDokumenGuruService;
