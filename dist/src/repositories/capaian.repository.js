"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertCapaianRepo = void 0;
const prisma_1 = require("../config/prisma");
const upsertCapaianRepo = async (guruId, mapelId, dataCapaian) => {
    return prisma_1.prisma.$transaction(dataCapaian.map((item) => prisma_1.prisma.capaianKompetensi.upsert({
        where: {
            siswaId_mapelId: {
                siswaId: item.siswaId,
                mapelId: mapelId,
            },
        },
        update: {
            deskripsi: item.deskripsi,
            guruId: guruId,
        },
        create: {
            siswaId: item.siswaId,
            mapelId: mapelId,
            guruId: guruId,
            deskripsi: item.deskripsi,
        },
    })));
};
exports.upsertCapaianRepo = upsertCapaianRepo;
