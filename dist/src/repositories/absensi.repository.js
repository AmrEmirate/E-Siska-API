"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSesiByIdRepo = exports.findSesiByKelasRepo = exports.createSesiRepo = void 0;
const prisma_1 = require("../config/prisma");
const createSesiRepo = async (data) => {
    try {
        const newSesi = await prisma_1.prisma.absensiSesi.create({
            data: {
                guruId: data.guruId,
                kelasId: data.kelasId,
                tanggal: data.tanggal,
                pertemuanKe: data.pertemuanKe,
            },
        });
        return newSesi;
    }
    catch (error) {
        throw error;
    }
};
exports.createSesiRepo = createSesiRepo;
const findSesiByKelasRepo = async (kelasId) => {
    return await prisma_1.prisma.absensiSesi.findMany({
        where: { kelasId },
        orderBy: { tanggal: "desc" },
        include: {
            _count: {
                select: { Detail: true },
            },
        },
    });
};
exports.findSesiByKelasRepo = findSesiByKelasRepo;
const findSesiByIdRepo = async (sesiId) => {
    return await prisma_1.prisma.absensiSesi.findUnique({
        where: { id: sesiId },
        include: {
            kelas: true,
            Detail: {
                include: {
                    siswa: true,
                },
            },
        },
    });
};
exports.findSesiByIdRepo = findSesiByIdRepo;
