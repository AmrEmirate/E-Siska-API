"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPenugasanUnik = exports.createPenugasanRepo = void 0;
const prisma_1 = require("../config/prisma");
const createPenugasanRepo = async (data) => {
    try {
        const newPenugasan = await prisma_1.prisma.penugasanGuru.create({
            data: {
                guruId: data.guruId,
                mapelId: data.mapelId,
                kelasId: data.kelasId,
            },
        });
        return newPenugasan;
    }
    catch (error) {
        throw error;
    }
};
exports.createPenugasanRepo = createPenugasanRepo;
const findPenugasanUnik = async (guruId, mapelId, kelasId) => {
    return prisma_1.prisma.penugasanGuru.findUnique({
        where: {
            guruId_mapelId_kelasId: {
                guruId: guruId,
                mapelId: mapelId,
                kelasId: kelasId,
            },
        },
    });
};
exports.findPenugasanUnik = findPenugasanUnik;
