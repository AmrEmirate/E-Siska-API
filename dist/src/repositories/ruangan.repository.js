"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRuanganRepo = exports.deleteRuanganRepo = exports.updateRuanganRepo = exports.createRuanganRepo = void 0;
const prisma_1 = require("../config/prisma");
const createRuanganRepo = async (data) => {
    try {
        const newRuangan = await prisma_1.prisma.ruangan.create({
            data: {
                namaRuangan: data.namaRuangan,
                kapasitas: data.kapasitas,
                adminId: data.adminId,
            },
        });
        return newRuangan;
    }
    catch (error) {
        throw error;
    }
};
exports.createRuanganRepo = createRuanganRepo;
const updateRuanganRepo = async (id, data) => {
    return await prisma_1.prisma.ruangan.update({
        where: { id },
        data,
    });
};
exports.updateRuanganRepo = updateRuanganRepo;
const deleteRuanganRepo = async (id) => {
    return await prisma_1.prisma.ruangan.delete({
        where: { id },
    });
};
exports.deleteRuanganRepo = deleteRuanganRepo;
const getAllRuanganRepo = async () => {
    return await prisma_1.prisma.ruangan.findMany({
        orderBy: {
            namaRuangan: "asc",
        },
    });
};
exports.getAllRuanganRepo = getAllRuanganRepo;
