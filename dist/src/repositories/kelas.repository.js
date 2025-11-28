"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKelasByGuruIdRepo = exports.getKelasByIdWithStudentsRepo = exports.getKelasByWaliKelasRepo = exports.findAllKelasRepo = exports.deleteKelasRepo = exports.updateKelasRepo = exports.createKelasRepo = void 0;
const prisma_1 = require("../config/prisma");
const createKelasRepo = async (data) => {
    try {
        const newKelas = await prisma_1.prisma.kelas.create({
            data: {
                namaKelas: data.namaKelas,
                tingkatanId: data.tingkatanId,
                waliKelasId: data.waliKelasId,
            },
        });
        return newKelas;
    }
    catch (error) {
        throw error;
    }
};
exports.createKelasRepo = createKelasRepo;
const updateKelasRepo = async (id, data) => {
    return await prisma_1.prisma.kelas.update({
        where: { id },
        data,
    });
};
exports.updateKelasRepo = updateKelasRepo;
const deleteKelasRepo = async (id) => {
    return await prisma_1.prisma.kelas.delete({
        where: { id },
    });
};
exports.deleteKelasRepo = deleteKelasRepo;
const findAllKelasRepo = async () => {
    return await prisma_1.prisma.kelas.findMany({
        include: {
            tingkatan: true,
            waliKelas: true,
            _count: {
                select: { Penempatan: true },
            },
        },
        orderBy: {
            namaKelas: "asc",
        },
    });
};
exports.findAllKelasRepo = findAllKelasRepo;
const getKelasByWaliKelasRepo = async (waliKelasId) => {
    return await prisma_1.prisma.kelas.findFirst({
        where: { waliKelasId },
        include: {
            tingkatan: true,
            Penempatan: {
                include: {
                    siswa: true,
                },
            },
        },
    });
};
exports.getKelasByWaliKelasRepo = getKelasByWaliKelasRepo;
const getKelasByIdWithStudentsRepo = async (kelasId) => {
    return await prisma_1.prisma.kelas.findUnique({
        where: { id: kelasId },
        include: {
            tingkatan: true,
            Penempatan: {
                include: {
                    siswa: true,
                },
            },
        },
    });
};
exports.getKelasByIdWithStudentsRepo = getKelasByIdWithStudentsRepo;
const getKelasByGuruIdRepo = async (guruId) => {
    const penugasan = await prisma_1.prisma.penugasanGuru.findMany({
        where: { guruId },
        include: {
            kelas: true,
        },
        distinct: ["kelasId"],
    });
    return penugasan.map((p) => p.kelas);
};
exports.getKelasByGuruIdRepo = getKelasByGuruIdRepo;
