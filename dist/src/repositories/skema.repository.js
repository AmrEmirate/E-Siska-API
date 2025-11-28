"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKomponenRepo = exports.getSkemaByMapelIdRepo = exports.addKomponenToSkemaRepo = void 0;
const prisma_1 = require("../config/prisma");
const addKomponenToSkemaRepo = async (data) => {
    return await prisma_1.prisma.nilaiKomponen.create({
        data: {
            skemaId: data.skemaId,
            namaKomponen: data.namaKomponen,
            tipe: data.tipe,
            formula: data.formula,
            urutan: data.urutan,
        },
    });
};
exports.addKomponenToSkemaRepo = addKomponenToSkemaRepo;
const getSkemaByMapelIdRepo = async (mapelId) => {
    return await prisma_1.prisma.skemaPenilaian.findUnique({
        where: { mapelId },
        include: {
            Komponen: {
                orderBy: { urutan: "asc" },
            },
            mapel: true,
        },
    });
};
exports.getSkemaByMapelIdRepo = getSkemaByMapelIdRepo;
const deleteKomponenRepo = async (komponenId) => {
    return await prisma_1.prisma.nilaiKomponen.delete({
        where: { id: komponenId },
    });
};
exports.deleteKomponenRepo = deleteKomponenRepo;
