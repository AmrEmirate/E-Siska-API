"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSesiDetailService = exports.getSesiByKelasService = exports.createSesiService = void 0;
const absensi_repository_1 = require("../repositories/absensi.repository");
const kelas_repository_1 = require("../repositories/kelas.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const createSesiService = async (data) => {
    logger_1.default.info(`Mencoba membuat sesi absensi untuk kelas ${data.kelasId}`);
    const penugasan = await prisma_1.prisma.penugasanGuru.findFirst({
        where: {
            guruId: data.guruId,
            kelasId: data.kelasId,
        },
    });
    if (!penugasan) {
        throw new AppError_1.default("Guru tidak terdaftar mengajar di kelas ini. Tidak bisa membuat sesi.", 403);
    }
    const tanggalObj = new Date(data.tanggal);
    const existingSesi = await prisma_1.prisma.absensiSesi.findUnique({
        where: {
            kelasId_tanggal_pertemuanKe: {
                kelasId: data.kelasId,
                tanggal: tanggalObj,
                pertemuanKe: data.pertemuanKe,
            },
        },
    });
    if (existingSesi) {
        throw new AppError_1.default(`Sesi pertemuan ke-${data.pertemuanKe} pada tanggal tersebut sudah dibuat.`, 409);
    }
    const newSesi = await (0, absensi_repository_1.createSesiRepo)({
        guruId: data.guruId,
        kelasId: data.kelasId,
        tanggal: tanggalObj,
        pertemuanKe: data.pertemuanKe,
    });
    return newSesi;
};
exports.createSesiService = createSesiService;
const getSesiByKelasService = async (kelasId) => {
    logger_1.default.info(`Fetching sessions for class: ${kelasId}`);
    return await (0, absensi_repository_1.findSesiByKelasRepo)(kelasId);
};
exports.getSesiByKelasService = getSesiByKelasService;
const getSesiDetailService = async (sesiId) => {
    logger_1.default.info(`Fetching session detail: ${sesiId}`);
    const sesi = await (0, absensi_repository_1.findSesiByIdRepo)(sesiId);
    if (!sesi) {
        throw new AppError_1.default("Sesi absensi tidak ditemukan", 404);
    }
    if (sesi.Detail && sesi.Detail.length > 0) {
        return {
            ...sesi,
            students: sesi.Detail.map((detail) => ({
                siswaId: detail.siswaId,
                nama: detail.siswa.nama,
                nis: detail.siswa.nis,
                status: detail.status,
            })),
        };
    }
    const kelas = await (0, kelas_repository_1.getKelasByIdWithStudentsRepo)(sesi.kelasId);
    if (!kelas) {
        throw new AppError_1.default("Data kelas tidak ditemukan", 404);
    }
    const students = kelas.Penempatan.map((p) => ({
        siswaId: p.siswa.id,
        nama: p.siswa.nama,
        nis: p.siswa.nis,
        status: null,
    }));
    return {
        ...sesi,
        students,
    };
};
exports.getSesiDetailService = getSesiDetailService;
