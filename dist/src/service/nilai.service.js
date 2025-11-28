"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNilaiService = exports.updateNilaiService = exports.getAllNilaiService = exports.getMyGradesService = exports.getNilaiKelasService = exports.inputNilaiService = void 0;
const nilai_repository_1 = require("../repositories/nilai.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const prisma_2 = require("../generated/prisma");
const kalkulasi_service_1 = require("./kalkulasi.service");
const inputNilaiService = async (input) => {
    logger_1.default.info(`Mencoba input nilai untuk mapel ${input.mapelId}, komponen ${input.komponenId}`);
    const penugasan = await prisma_1.prisma.penugasanGuru.findFirst({
        where: {
            guruId: input.guruId,
            mapelId: input.mapelId,
        },
    });
    if (!penugasan) {
        throw new AppError_1.default("Anda tidak terdaftar sebagai pengajar mata pelajaran ini.", 403);
    }
    const komponen = await prisma_1.prisma.nilaiKomponen.findUnique({
        where: { id: input.komponenId },
        include: { skema: true },
    });
    if (!komponen) {
        throw new AppError_1.default("Komponen nilai tidak ditemukan.", 404);
    }
    if (komponen.skema.mapelId !== input.mapelId) {
        throw new AppError_1.default("Komponen nilai ini tidak milik mata pelajaran yang dipilih.", 400);
    }
    if (komponen.tipe !== prisma_2.NilaiKomponenType.INPUT) {
        throw new AppError_1.default("Anda hanya dapat menginput nilai pada komponen bertipe INPUT. Komponen READ_ONLY dihitung otomatis.", 400);
    }
    const result = await (0, nilai_repository_1.upsertNilaiRepo)(input.guruId, input.mapelId, input.komponenId, input.data);
    const affectedSiswaIds = input.data.map((d) => d.siswaId);
    await (0, kalkulasi_service_1.calculateGradesService)(input.mapelId, affectedSiswaIds);
    return result;
};
exports.inputNilaiService = inputNilaiService;
const getNilaiKelasService = async (guruId, kelasId, mapelId) => {
    const { students, grades } = await (0, nilai_repository_1.getNilaiKelasRepo)(kelasId, mapelId);
    const formattedData = students.map((p) => {
        const studentGrades = grades.filter((g) => g.siswaId === p.siswaId);
        const gradesMap = {};
        studentGrades.forEach((g) => {
            if (g.komponenId && g.nilaiAngka !== null) {
                gradesMap[g.komponenId] = g.nilaiAngka;
            }
        });
        return {
            siswaId: p.siswaId,
            nis: p.siswa.nis,
            nama: p.siswa.nama,
            grades: gradesMap,
        };
    });
    return formattedData;
};
exports.getNilaiKelasService = getNilaiKelasService;
const getMyGradesService = async (siswaId) => {
    logger_1.default.info(`Fetching grades for student: ${siswaId}`);
    const grades = await (0, nilai_repository_1.getNilaiBySiswaIdRepo)(siswaId);
    const groupedGrades = {};
    grades.forEach((g) => {
        const mapelName = g.mapel.namaMapel;
        if (!groupedGrades[mapelName]) {
            groupedGrades[mapelName] = {
                mapel: mapelName,
                kategori: g.mapel.kategori,
                components: [],
            };
        }
        groupedGrades[mapelName].components.push({
            komponen: g.komponen?.namaKomponen || "Unknown",
            tipe: g.komponen?.tipe,
            nilai: g.nilaiAngka,
            guru: g.guru.nama,
        });
    });
    return Object.values(groupedGrades);
};
exports.getMyGradesService = getMyGradesService;
const getAllNilaiService = async (filters) => {
    logger_1.default.info(`Fetching all nilai with filters: ${JSON.stringify(filters)}`);
    const data = await (0, nilai_repository_1.getAllNilaiRepo)(filters);
    return data.map((nilai) => ({
        id: nilai.id,
        siswaId: nilai.siswaId,
        mapelId: nilai.mapelId,
        komponenId: nilai.komponenId,
        nilai: nilai.nilaiAngka,
        siswa: nilai.siswa,
        mapel: nilai.mapel,
        skema: nilai.komponen,
    }));
};
exports.getAllNilaiService = getAllNilaiService;
const updateNilaiService = async (id, nilai, guruId) => {
    logger_1.default.info(`Updating nilai ${id} with new value: ${nilai}`);
    const existingNilai = await prisma_1.prisma.nilaiDetailSiswa.findUnique({
        where: { id },
        include: { komponen: true },
    });
    if (!existingNilai) {
        throw new AppError_1.default("Nilai tidak ditemukan.", 404);
    }
    if (existingNilai.komponen?.tipe !== prisma_2.NilaiKomponenType.INPUT) {
        throw new AppError_1.default("Anda hanya dapat mengubah nilai pada komponen bertipe INPUT.", 400);
    }
    const result = await (0, nilai_repository_1.updateNilaiRepo)(id, nilai, guruId);
    await (0, kalkulasi_service_1.calculateGradesService)(result.mapelId, [result.siswaId]);
    return result;
};
exports.updateNilaiService = updateNilaiService;
const deleteNilaiService = async (id) => {
    logger_1.default.info(`Deleting nilai ${id}`);
    const existingNilai = await prisma_1.prisma.nilaiDetailSiswa.findUnique({
        where: { id },
        include: { komponen: true },
    });
    if (!existingNilai) {
        throw new AppError_1.default("Nilai tidak ditemukan.", 404);
    }
    if (existingNilai.komponen?.tipe !== prisma_2.NilaiKomponenType.INPUT) {
        throw new AppError_1.default("Anda hanya dapat menghapus nilai pada komponen bertipe INPUT.", 400);
    }
    const result = await (0, nilai_repository_1.deleteNilaiRepo)(id);
    await (0, kalkulasi_service_1.calculateGradesService)(existingNilai.mapelId, [existingNilai.siswaId]);
    return result;
};
exports.deleteNilaiService = deleteNilaiService;
