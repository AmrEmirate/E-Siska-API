"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTingkatanRepo = void 0;
const prisma_1 = require("../config/prisma");
const createTingkatanRepo = async (namaTingkat) => {
    try {
        const newTingkatan = await prisma_1.prisma.tingkatanKelas.create({
            data: {
                namaTingkat: namaTingkat,
                adminId: "ce00f605-e1e5-4e9a-95b0-1514490a8af4",
            },
        });
        return newTingkatan;
    }
    catch (error) {
        throw error;
    }
};
exports.createTingkatanRepo = createTingkatanRepo;
