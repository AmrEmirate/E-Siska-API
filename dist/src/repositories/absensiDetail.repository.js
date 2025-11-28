"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertAbsensiDetailRepo = void 0;
const prisma_1 = require("../config/prisma");
const upsertAbsensiDetailRepo = async (sesiId, dataSiswa) => {
    return prisma_1.prisma.$transaction(dataSiswa.map((item) => prisma_1.prisma.absensiDetail.upsert({
        where: {
            siswaId_sesiId: {
                sesiId: sesiId,
                siswaId: item.siswaId,
            },
        },
        update: {
            status: item.status,
        },
        create: {
            sesiId: sesiId,
            siswaId: item.siswaId,
            status: item.status,
        },
    })));
};
exports.upsertAbsensiDetailRepo = upsertAbsensiDetailRepo;
