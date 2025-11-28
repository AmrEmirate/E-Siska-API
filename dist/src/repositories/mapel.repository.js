"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMapelRepo = exports.deleteMapelRepo = exports.updateMapelRepo = exports.createMapelRepo = void 0;
const prisma_1 = require("../config/prisma");
const createMapelRepo = async (data) => {
    const { namaMapel, kategori, adminId } = data;
    try {
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const newMapel = await tx.mataPelajaran.create({
                data: {
                    namaMapel: namaMapel,
                    kategori: kategori,
                    adminId: adminId,
                },
            });
            const newSkema = await tx.skemaPenilaian.create({
                data: {
                    mapelId: newMapel.id,
                    adminId: adminId,
                },
            });
            return { mapel: newMapel, skema: newSkema };
        });
        return result;
    }
    catch (error) {
        throw error;
    }
};
exports.createMapelRepo = createMapelRepo;
const updateMapelRepo = async (id, data) => {
    return await prisma_1.prisma.mataPelajaran.update({
        where: { id },
        data,
    });
};
exports.updateMapelRepo = updateMapelRepo;
const deleteMapelRepo = async (id) => {
    return await prisma_1.prisma.mataPelajaran.delete({
        where: { id },
    });
};
exports.deleteMapelRepo = deleteMapelRepo;
const getAllMapelRepo = async () => {
    return await prisma_1.prisma.mataPelajaran.findMany({
        orderBy: { namaMapel: "asc" },
    });
};
exports.getAllMapelRepo = getAllMapelRepo;
