"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPenempatanBySiswaAndTahun = exports.createPenempatanRepo = void 0;
const prisma_1 = require("../config/prisma");
const createPenempatanRepo = async (data) => {
    try {
        const newPenempatan = await prisma_1.prisma.penempatanSiswa.create({
            data: {
                siswaId: data.siswaId,
                kelasId: data.kelasId,
                tahunAjaranId: data.tahunAjaranId,
            },
        });
        return newPenempatan;
    }
    catch (error) {
        throw error;
    }
};
exports.createPenempatanRepo = createPenempatanRepo;
const findPenempatanBySiswaAndTahun = async (siswaId, tahunAjaranId) => {
    return prisma_1.prisma.penempatanSiswa.findUnique({
        where: {
            siswaId_tahunAjaranId: {
                siswaId: siswaId,
                tahunAjaranId: tahunAjaranId,
            },
        },
    });
};
exports.findPenempatanBySiswaAndTahun = findPenempatanBySiswaAndTahun;
