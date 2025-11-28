"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJadwalRepo = void 0;
const prisma_1 = require("../config/prisma");
const createJadwalRepo = async (data) => {
    try {
        const newJadwal = await prisma_1.prisma.jadwal.create({
            data: {
                tahunAjaranId: data.tahunAjaranId,
                kelasId: data.kelasId,
                mapelId: data.mapelId,
                guruId: data.guruId,
                ruanganId: data.ruanganId,
                hari: data.hari,
                waktuMulai: data.waktuMulai,
                waktuSelesai: data.waktuSelesai,
            },
        });
        return newJadwal;
    }
    catch (error) {
        throw error;
    }
};
exports.createJadwalRepo = createJadwalRepo;
