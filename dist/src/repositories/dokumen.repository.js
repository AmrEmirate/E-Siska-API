"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDokumenRepo = void 0;
const prisma_1 = require("../config/prisma");
const createDokumenRepo = async (data) => {
    try {
        const newDokumen = await prisma_1.prisma.dokumen.create({
            data: {
                judul: data.judul,
                urlFile: data.urlFile,
                adminId: data.adminId,
            },
        });
        return newDokumen;
    }
    catch (error) {
        throw error;
    }
};
exports.createDokumenRepo = createDokumenRepo;
