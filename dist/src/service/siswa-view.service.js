"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDokumenService = exports.getPengumumanService = exports.getMyJadwalService = exports.getMyNilaiService = exports.getMyAbsensiService = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = __importDefault(require("../utils/AppError"));
const logger_1 = __importDefault(require("../utils/logger"));
const getMyAbsensiService = async (siswaId, tahunAjaranId) => {
    logger_1.default.info(`Fetching attendance for siswa: ${siswaId}`);
    const penempatan = await prisma_1.prisma.penempatanSiswa.findFirst({
        where: {
            siswaId: siswaId,
            ...(tahunAjaranId && { tahunAjaranId }),
        },
        include: {
            kelas: true,
            tahunAjaran: true,
        },
    });
    if (!penempatan) {
        throw new AppError_1.default("Penempatan siswa tidak ditemukan", 404);
    }
    const absensiDetails = await prisma_1.prisma.absensiDetail.findMany({
        where: {
            siswaId: siswaId,
            sesi: {
                kelasId: penempatan.kelasId,
            },
        },
        include: {
            sesi: true,
        },
        orderBy: {
            sesi: {
                tanggal: "desc",
            },
        },
    });
    const summary = {
        hadir: absensiDetails.filter((a) => a.status === "HADIR").length,
        sakit: absensiDetails.filter((a) => a.status === "SAKIT").length,
        izin: absensiDetails.filter((a) => a.status === "IZIN").length,
        alpha: absensiDetails.filter((a) => a.status === "ALPHA").length,
        total: absensiDetails.length,
    };
    return {
        kelas: penempatan.kelas,
        tahunAjaran: penempatan.tahunAjaran,
        summary,
        details: absensiDetails,
    };
};
exports.getMyAbsensiService = getMyAbsensiService;
const getMyNilaiService = async (siswaId, tahunAjaranId) => {
    logger_1.default.info(`Fetching grades for siswa: ${siswaId}`);
    const penempatan = await prisma_1.prisma.penempatanSiswa.findFirst({
        where: {
            siswaId: siswaId,
            ...(tahunAjaranId && { tahunAjaranId }),
        },
        include: {
            kelas: {
                include: {
                    tingkatan: true,
                },
            },
            tahunAjaran: true,
        },
    });
    if (!penempatan) {
        throw new AppError_1.default("Penempatan siswa tidak ditemukan", 404);
    }
    const nilaiDetail = await prisma_1.prisma.nilaiDetailSiswa.findMany({
        where: {
            siswaId: siswaId,
        },
        include: {
            komponen: {
                include: {
                    skema: {
                        include: {
                            mapel: true,
                        },
                    },
                },
            },
            mapel: true,
        },
    });
    const capaianKompetensi = await prisma_1.prisma.capaianKompetensi.findMany({
        where: {
            siswaId: siswaId,
        },
        include: {
            mapel: true,
        },
    });
    const rapor = await prisma_1.prisma.rapor.findFirst({
        where: {
            siswaId: siswaId,
            tahunAjaranId: penempatan.tahunAjaranId,
        },
        include: {
            NilaiRaporAkhir: {
                include: {
                    mapel: true,
                },
            },
        },
    });
    return {
        kelas: penempatan.kelas,
        tahunAjaran: penempatan.tahunAjaran,
        nilaiDetail: nilaiDetail,
        capaianKompetensi: capaianKompetensi,
        nilaiAkhir: rapor?.NilaiRaporAkhir || [],
    };
};
exports.getMyNilaiService = getMyNilaiService;
const getMyJadwalService = async (siswaId) => {
    logger_1.default.info(`Fetching schedule for siswa: ${siswaId}`);
    const penempatan = await prisma_1.prisma.penempatanSiswa.findFirst({
        where: {
            siswaId: siswaId,
        },
        include: {
            kelas: true,
            tahunAjaran: true,
        },
    });
    if (!penempatan) {
        throw new AppError_1.default("Penempatan siswa tidak ditemukan", 404);
    }
    const jadwal = await prisma_1.prisma.jadwal.findMany({
        where: {
            kelasId: penempatan.kelasId,
            tahunAjaranId: penempatan.tahunAjaranId,
        },
        include: {
            mapel: true,
            guru: true,
            ruangan: true,
        },
        orderBy: [{ hari: "asc" }, { waktuMulai: "asc" }],
    });
    return {
        kelas: penempatan.kelas,
        tahunAjaran: penempatan.tahunAjaran,
        jadwal: jadwal,
    };
};
exports.getMyJadwalService = getMyJadwalService;
const getPengumumanService = async () => {
    logger_1.default.info("Fetching all pengumuman");
    const pengumuman = await prisma_1.prisma.pengumuman.findMany({
        orderBy: {
            tanggalPublikasi: "desc",
        },
        take: 50,
    });
    return pengumuman;
};
exports.getPengumumanService = getPengumumanService;
const getDokumenService = async () => {
    logger_1.default.info("Fetching all dokumen");
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
exports.getDokumenService = getDokumenService;
