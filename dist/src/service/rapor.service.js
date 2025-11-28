"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRaporService = exports.overrideNilaiRaporService = exports.definalizeRaporService = exports.finalizeRaporService = exports.generateRaporService = exports.inputDataRaporService = void 0;
const rapor_repository_1 = require("../repositories/rapor.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const rapor_repository_2 = require("../repositories/rapor.repository");
const inputDataRaporService = async (input) => {
    logger_1.default.info(`Mencoba update data rapor siswa ${input.siswaId} oleh guru ${input.guruId}`);
    const penempatan = await prisma_1.prisma.penempatanSiswa.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
        include: { kelas: true },
    });
    if (!penempatan) {
        throw new AppError_1.default("Siswa belum ditempatkan di kelas untuk tahun ajaran ini.", 404);
    }
    if (penempatan.kelas.waliKelasId !== input.guruId) {
        throw new AppError_1.default("Anda bukan Wali Kelas dari siswa ini.", 403);
    }
    const existingRapor = await prisma_1.prisma.rapor.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
    });
    if (existingRapor?.isFinalisasi) {
        throw new AppError_1.default("Rapor sudah difinalisasi. Lakukan definalisasi terlebih dahulu untuk mengubah data.", 400);
    }
    const result = await (0, rapor_repository_1.upsertRaporRepo)({
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
        kelasId: penempatan.kelasId,
        waliKelasId: input.guruId,
        catatanWaliKelas: input.catatan,
        dataKokurikuler: input.kokurikuler,
    });
    return result;
};
exports.inputDataRaporService = inputDataRaporService;
const generateRaporService = async (input) => {
    const penempatan = await prisma_1.prisma.penempatanSiswa.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
        include: { kelas: true, siswa: true, tahunAjaran: true },
    });
    if (!penempatan)
        throw new AppError_1.default("Data penempatan siswa tidak ditemukan", 404);
    if (penempatan.kelas.waliKelasId !== input.guruId) {
        throw new AppError_1.default("Anda bukan Wali Kelas siswa ini", 403);
    }
    const [absensi, nilaiData, ekskulData, dataRapor] = await Promise.all([
        (0, rapor_repository_2.getAbsensiSummaryRepo)(input.siswaId, input.tahunAjaranId),
        (0, rapor_repository_2.getNilaiRaporRepo)(input.siswaId),
        (0, rapor_repository_2.getNilaiEkskulRepo)(input.siswaId),
        (0, rapor_repository_2.getRaporDataRepo)(input.siswaId, input.tahunAjaranId),
    ]);
    const mapelMap = new Map();
    nilaiData.nilaiDetails.forEach((n) => {
        const mapelName = n.mapel.namaMapel;
        if (!mapelMap.has(mapelName)) {
            mapelMap.set(mapelName, {
                kkm: 75,
                nilaiAkhir: 0,
                predikat: "",
                deskripsi: "",
            });
        }
        if (n.komponen?.namaKomponen === "Nilai Akhir" ||
            (n.komponen?.tipe === "READ_ONLY" && n.nilaiAngka)) {
            const current = mapelMap.get(mapelName);
            current.nilaiAkhir = n.nilaiAngka || 0;
            current.predikat =
                current.nilaiAkhir >= 90 ? "A" : current.nilaiAkhir >= 80 ? "B" : "C";
        }
    });
    nilaiData.capaianDetails.forEach((c) => { });
    const nilaiAkademik = Array.from(mapelMap, ([nama, val]) => ({
        mapel: nama,
        ...val,
    }));
    const ekstrakurikuler = ekskulData.map((e) => ({
        nama: e.mapel.namaMapel,
        nilai: "A",
        deskripsi: e.nilaiDeskripsi,
    }));
    return {
        infoSiswa: {
            nama: penempatan.siswa.nama,
            nis: penempatan.siswa.nis,
            kelas: penempatan.kelas.namaKelas,
            tahunAjaran: penempatan.tahunAjaran.nama,
        },
        nilaiAkademik,
        ekstrakurikuler,
        ketidakhadiran: absensi,
        catatanWaliKelas: dataRapor?.catatanWaliKelas || "-",
        dataKokurikuler: dataRapor?.dataKokurikuler || "-",
        status: dataRapor?.isFinalisasi ? "FINAL" : "DRAFT",
        tanggalCetak: new Date(),
    };
};
exports.generateRaporService = generateRaporService;
const finalizeRaporService = async (input) => {
    const penempatan = await prisma_1.prisma.penempatanSiswa.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
        include: { kelas: true },
    });
    if (!penempatan)
        throw new AppError_1.default("Data penempatan siswa tidak ditemukan", 404);
    if (penempatan.kelas.waliKelasId !== input.guruId) {
        throw new AppError_1.default("Anda bukan Wali Kelas siswa ini", 403);
    }
    const rapor = await prisma_1.prisma.rapor.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
    });
    if (!rapor)
        throw new AppError_1.default("Data rapor belum diinisialisasi (belum ada catatan/kokurikuler).", 400);
    if (!rapor.catatanWaliKelas || !rapor.dataKokurikuler) {
        throw new AppError_1.default("Catatan Wali Kelas dan Data Kokurikuler wajib diisi sebelum finalisasi.", 400);
    }
    return await prisma_1.prisma.rapor.update({
        where: { id: rapor.id },
        data: { isFinalisasi: true },
    });
};
exports.finalizeRaporService = finalizeRaporService;
const definalizeRaporService = async (input) => {
    const penempatan = await prisma_1.prisma.penempatanSiswa.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
        include: { kelas: true },
    });
    if (!penempatan)
        throw new AppError_1.default("Data penempatan siswa tidak ditemukan", 404);
    if (penempatan.kelas.waliKelasId !== input.guruId) {
        throw new AppError_1.default("Anda bukan Wali Kelas siswa ini", 403);
    }
    const rapor = await prisma_1.prisma.rapor.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
    });
    if (!rapor)
        throw new AppError_1.default("Data rapor tidak ditemukan.", 404);
    return await prisma_1.prisma.rapor.update({
        where: { id: rapor.id },
        data: { isFinalisasi: false },
    });
};
exports.definalizeRaporService = definalizeRaporService;
const overrideNilaiRaporService = async (input) => {
    const rapor = await prisma_1.prisma.rapor.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: input.siswaId,
                tahunAjaranId: input.tahunAjaranId,
            },
        },
    });
    if (!rapor)
        throw new AppError_1.default("Rapor siswa belum dibuat. Harap minta Wali Kelas mengisi data awal terlebih dahulu.", 404);
    return await prisma_1.prisma.nilaiRaporAkhir.upsert({
        where: {
            raporId_mapelId: {
                raporId: rapor.id,
                mapelId: input.mapelId,
            },
        },
        update: {
            nilaiAkhir: input.nilaiAkhir,
            isOverride: true,
        },
        create: {
            raporId: rapor.id,
            mapelId: input.mapelId,
            nilaiAkhir: input.nilaiAkhir,
            isOverride: true,
        },
    });
};
exports.overrideNilaiRaporService = overrideNilaiRaporService;
const getMyRaporService = async (siswaId) => {
    logger_1.default.info(`Fetching reports for student: ${siswaId}`);
    const rapors = await (0, rapor_repository_2.getRaporBySiswaIdRepo)(siswaId);
    return rapors;
};
exports.getMyRaporService = getMyRaporService;
