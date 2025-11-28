"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNilaiRepo = exports.updateNilaiRepo = exports.getAllNilaiRepo = exports.getNilaiBySiswaIdRepo = exports.getNilaiKelasRepo = exports.upsertNilaiRepo = void 0;
const prisma_1 = require("../config/prisma");
const upsertNilaiRepo = async (guruId, mapelId, komponenId, dataNilai) => {
    return prisma_1.prisma.$transaction(dataNilai.map((item) => prisma_1.prisma.nilaiDetailSiswa.upsert({
        where: {
            siswaId_mapelId_komponenId: {
                siswaId: item.siswaId,
                mapelId: mapelId,
                komponenId: komponenId,
            },
        },
        update: {
            nilaiAngka: item.nilai,
            guruId: guruId,
        },
        create: {
            siswaId: item.siswaId,
            mapelId: mapelId,
            komponenId: komponenId,
            guruId: guruId,
            nilaiAngka: item.nilai,
        },
    })));
};
exports.upsertNilaiRepo = upsertNilaiRepo;
const getNilaiKelasRepo = async (kelasId, mapelId) => {
    const students = await prisma_1.prisma.penempatanSiswa.findMany({
        where: { kelasId },
        include: { siswa: true },
        orderBy: { siswa: { nama: "asc" } },
    });
    const grades = await prisma_1.prisma.nilaiDetailSiswa.findMany({
        where: {
            mapelId,
            siswaId: { in: students.map((s) => s.siswaId) },
        },
    });
    return { students, grades };
};
exports.getNilaiKelasRepo = getNilaiKelasRepo;
const getNilaiBySiswaIdRepo = async (siswaId) => {
    return await prisma_1.prisma.nilaiDetailSiswa.findMany({
        where: { siswaId },
        include: {
            mapel: true,
            komponen: true,
            guru: {
                select: { nama: true },
            },
        },
        orderBy: {
            mapel: { namaMapel: "asc" },
        },
    });
};
exports.getNilaiBySiswaIdRepo = getNilaiBySiswaIdRepo;
const getAllNilaiRepo = async (filters) => {
    return await prisma_1.prisma.nilaiDetailSiswa.findMany({
        where: {
            ...(filters?.siswaId && { siswaId: filters.siswaId }),
            ...(filters?.mapelId && { mapelId: filters.mapelId }),
        },
        include: {
            siswa: {
                select: {
                    id: true,
                    nama: true,
                    nis: true,
                },
            },
            mapel: {
                select: {
                    id: true,
                    namaMapel: true,
                },
            },
            komponen: {
                select: {
                    id: true,
                    namaKomponen: true,
                },
            },
            guru: {
                select: {
                    id: true,
                    nama: true,
                },
            },
        },
        orderBy: [{ siswa: { nama: "asc" } }, { mapel: { namaMapel: "asc" } }],
    });
};
exports.getAllNilaiRepo = getAllNilaiRepo;
const updateNilaiRepo = async (id, nilai, guruId) => {
    return await prisma_1.prisma.nilaiDetailSiswa.update({
        where: { id },
        data: {
            nilaiAngka: nilai,
            guruId: guruId,
        },
        include: {
            siswa: true,
            mapel: true,
            komponen: true,
        },
    });
};
exports.updateNilaiRepo = updateNilaiRepo;
const deleteNilaiRepo = async (id) => {
    return await prisma_1.prisma.nilaiDetailSiswa.delete({
        where: { id },
    });
};
exports.deleteNilaiRepo = deleteNilaiRepo;
