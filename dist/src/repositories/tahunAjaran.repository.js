"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTahunAjaranRepo = void 0;
const prisma_1 = require("../config/prisma");
const createTahunAjaranRepo = async (data) => {
    try {
        const newTahunAjaran = await prisma_1.prisma.tahunAjaran.create({
            data: {
                nama: data.nama,
                adminId: data.adminId,
            },
        });
        return newTahunAjaran;
    }
    catch (error) {
        throw error;
    }
};
exports.createTahunAjaranRepo = createTahunAjaranRepo;
