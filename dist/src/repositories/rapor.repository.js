"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaporBySiswaIdRepo = exports.getRaporDataRepo = exports.getNilaiEkskulRepo = exports.getNilaiRaporRepo = exports.getAbsensiSummaryRepo = exports.upsertRaporRepo = void 0;
const prisma_1 = require("../config/prisma");
const prisma_2 = require("../generated/prisma");
const upsertRaporRepo = async (data) => {
    return prisma_1.prisma.rapor.upsert({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: data.siswaId,
                tahunAjaranId: data.tahunAjaranId,
            },
        },
        update: {
            catatanWaliKelas: data.catatanWaliKelas,
            dataKokurikuler: data.dataKokurikuler,
            kelasId: data.kelasId,
            waliKelasId: data.waliKelasId,
        },
        create: {
            siswaId: data.siswaId,
            tahunAjaranId: data.tahunAjaranId,
            kelasId: data.kelasId,
            waliKelasId: data.waliKelasId,
            catatanWaliKelas: data.catatanWaliKelas,
            dataKokurikuler: data.dataKokurikuler,
            isFinalisasi: false,
        },
    });
};
exports.upsertRaporRepo = upsertRaporRepo;
const getAbsensiSummaryRepo = async (siswaId, tahunAjaranId) => {
    const absensi = await prisma_1.prisma.absensiDetail.findMany({
        where: {
            siswaId: siswaId,
            sesi: {},
        },
    });
    const summary = {
        [prisma_2.AbsensiStatus.SAKIT]: 0,
        [prisma_2.AbsensiStatus.IZIN]: 0,
        [prisma_2.AbsensiStatus.ALPHA]: 0,
        [prisma_2.AbsensiStatus.HADIR]: 0,
    };
    absensi.forEach((a) => {
        summary[a.status]++;
    });
    return summary;
};
exports.getAbsensiSummaryRepo = getAbsensiSummaryRepo;
const getNilaiRaporRepo = async (siswaId) => {
    const nilaiDetails = await prisma_1.prisma.nilaiDetailSiswa.findMany({
        where: { siswaId: siswaId, mapel: { kategori: "WAJIB" } },
        include: {
            mapel: true,
            komponen: true,
        },
    });
    const capaianDetails = await prisma_1.prisma.capaianKompetensi.findMany({
        where: { siswaId: siswaId },
    });
    return { nilaiDetails, capaianDetails };
};
exports.getNilaiRaporRepo = getNilaiRaporRepo;
const getNilaiEkskulRepo = async (siswaId) => {
    return prisma_1.prisma.nilaiDetailSiswa.findMany({
        where: {
            siswaId: siswaId,
            mapel: { kategori: "EKSTRAKURIKULER" },
            komponenId: null,
        },
        include: { mapel: true },
    });
};
exports.getNilaiEkskulRepo = getNilaiEkskulRepo;
const getRaporDataRepo = async (siswaId, tahunAjaranId) => {
    return prisma_1.prisma.rapor.findUnique({
        where: { siswaId_tahunAjaranId: { siswaId, tahunAjaranId } },
        include: { waliKelas: true },
    });
};
exports.getRaporDataRepo = getRaporDataRepo;
const getRaporBySiswaIdRepo = async (siswaId) => {
    return await prisma_1.prisma.rapor.findMany({
        where: { siswaId, isFinalisasi: true },
        include: {
            tahunAjaran: true,
            kelas: true,
            waliKelas: true,
            NilaiRaporAkhir: {
                include: {
                    mapel: true,
                },
            },
        },
        orderBy: {
            tahunAjaran: { nama: "desc" },
        },
    });
};
exports.getRaporBySiswaIdRepo = getRaporBySiswaIdRepo;
