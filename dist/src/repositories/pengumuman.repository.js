"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPengumumanRepo = void 0;
const prisma_1 = require("../config/prisma");
const createPengumumanRepo = async (data) => {
    try {
        const newPengumuman = await prisma_1.prisma.pengumuman.create({
            data: {
                judul: data.judul,
                konten: data.konten,
                adminId: data.adminId,
            },
        });
        return newPengumuman;
    }
    catch (error) {
        throw error;
    }
};
exports.createPengumumanRepo = createPengumumanRepo;
