"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyKelasService = exports.getDataSiswaBimbinganService = exports.getRekapAbsensiKelasService = exports.getRekapNilaiKelasService = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = __importDefault(require("../utils/AppError"));
const logger_1 = __importDefault(require("../utils/logger"));
const getRekapNilaiKelasService = async (guruId, kelasId) => {
    logger_1.default.info(`Guru ${guruId} fetching rekap nilai for kelas ${kelasId}`);
    const kelas = await prisma_1.prisma.kelas.findUnique({
        where: { id: kelasId },
        include: {
            tingkatan: true,
        },
    });
    if (!kelas) {
        throw new AppError_1.default("Kelas tidak ditemukan", 404);
    }
    if (kelas.waliKelasId !== guruId) {
        throw new AppError_1.default("Anda bukan wali kelas dari kelas ini", 403);
    }
    const siswaList = await prisma_1.prisma.penempatanSiswa.findMany({
        where: {
            kelasId: kelasId,
        },
        include: {
            siswa: true,
            tahunAjaran: true,
        },
    });
    const rekapNilai = await Promise.all(siswaList.map(async (penempatan) => {
        const rapor = await prisma_1.prisma.rapor.findFirst({
            where: {
                siswaId: penempatan.siswaId,
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
            siswa: penempatan.siswa,
            rapor: rapor,
            nilaiAkhir: rapor?.NilaiRaporAkhir || [],
        };
    }));
    return {
        kelas: kelas,
        siswaList: rekapNilai,
    };
};
exports.getRekapNilaiKelasService = getRekapNilaiKelasService;
const getRekapAbsensiKelasService = async (guruId, kelasId) => {
    logger_1.default.info(`Guru ${guruId} fetching rekap absensi for kelas ${kelasId}`);
    const kelas = await prisma_1.prisma.kelas.findUnique({
        where: { id: kelasId },
        include: {
            tingkatan: true,
        },
    });
    if (!kelas) {
        throw new AppError_1.default("Kelas tidak ditemukan", 404);
    }
    if (kelas.waliKelasId !== guruId) {
        throw new AppError_1.default("Anda bukan wali kelas dari kelas ini", 403);
    }
    const siswaList = await prisma_1.prisma.penempatanSiswa.findMany({
        where: {
            kelasId: kelasId,
        },
        include: {
            siswa: true,
        },
    });
    const rekapAbsensi = await Promise.all(siswaList.map(async (penempatan) => {
        const absensiDetails = await prisma_1.prisma.absensiDetail.findMany({
            where: {
                siswaId: penempatan.siswaId,
                sesi: {
                    kelasId: kelasId,
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
            siswa: penempatan.siswa,
            summary: summary,
        };
    }));
    return {
        kelas: kelas,
        rekapAbsensi: rekapAbsensi,
    };
};
exports.getRekapAbsensiKelasService = getRekapAbsensiKelasService;
const getDataSiswaBimbinganService = async (guruId, kelasId) => {
    logger_1.default.info(`Guru ${guruId} fetching data siswa for kelas ${kelasId}`);
    const kelas = await prisma_1.prisma.kelas.findUnique({
        where: { id: kelasId },
        include: {
            tingkatan: true,
        },
    });
    if (!kelas) {
        throw new AppError_1.default("Kelas tidak ditemukan", 404);
    }
    if (kelas.waliKelasId !== guruId) {
        throw new AppError_1.default("Anda bukan wali kelas dari kelas ini", 403);
    }
    const siswaList = await prisma_1.prisma.penempatanSiswa.findMany({
        where: {
            kelasId: kelasId,
        },
        include: {
            siswa: {
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
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
    return {
        kelas: kelas,
        totalSiswa: siswaList.length,
        siswaList: siswaList.map((p) => ({
            ...p.siswa,
            tahunAjaran: p.tahunAjaran,
        })),
    };
};
exports.getDataSiswaBimbinganService = getDataSiswaBimbinganService;
const getMyKelasService = async (guruId) => {
    logger_1.default.info(`Guru ${guruId} fetching own kelas as wali kelas`);
    const kelas = await prisma_1.prisma.kelas.findFirst({
        where: {
            waliKelasId: guruId,
        },
        include: {
            tingkatan: true,
        },
    });
    if (!kelas) {
        throw new AppError_1.default("Anda belum ditugaskan sebagai wali kelas", 404);
    }
    const studentCount = await prisma_1.prisma.penempatanSiswa.count({
        where: {
            kelasId: kelas.id,
        },
    });
    return {
        ...kelas,
        jumlahSiswa: studentCount,
    };
};
exports.getMyKelasService = getMyKelasService;
