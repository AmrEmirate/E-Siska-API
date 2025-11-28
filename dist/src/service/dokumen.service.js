"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDokumenService = exports.getAllDokumenService = exports.createDokumenService = void 0;
const dokumen_repository_1 = require("../repositories/dokumen.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const cloudinary_1 = require("../config/cloudinary");
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const createDokumenService = async (data) => {
    logger_1.default.info(`Mencoba mengupload dokumen: ${data.judul}`);
    const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(data.file);
    logger_1.default.info(`File berhasil diupload ke Cloudinary: ${uploadResult.secure_url}`);
    const ADMIN_USER_ID_DUMMY = (await prisma_1.prisma.admin.findFirst({
        where: { id: "dummy-admin-id-untuk-tes" },
        include: { user: true },
    }))?.user.id || "dummy-admin-user-id";
    const repoInput = {
        judul: data.judul,
        urlFile: uploadResult.secure_url,
        adminId: ADMIN_USER_ID_DUMMY,
    };
    const newDokumen = await (0, dokumen_repository_1.createDokumenRepo)(repoInput);
    return newDokumen;
};
exports.createDokumenService = createDokumenService;
const getAllDokumenService = async (page = 1, limit = 50) => {
    const skip = (page - 1) * limit;
    const take = limit;
    logger_1.default.info(`Fetching all dokumen - Page: ${page}, Limit: ${limit}`);
    const dokumen = await prisma_1.prisma.dokumen.findMany({
        skip,
        take,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            judul: true,
            urlFile: true,
            createdAt: true,
        },
    });
    const total = await prisma_1.prisma.dokumen.count();
    return {
        data: dokumen,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getAllDokumenService = getAllDokumenService;
const deleteDokumenService = async (id) => {
    logger_1.default.info(`Deleting dokumen: ${id}`);
    const dokumen = await prisma_1.prisma.dokumen.findUnique({
        where: { id },
    });
    if (!dokumen) {
        throw new AppError_1.default("Dokumen tidak ditemukan", 404);
    }
    await prisma_1.prisma.dokumen.delete({
        where: { id },
    });
    return { message: "Dokumen berhasil dihapus" };
};
exports.deleteDokumenService = deleteDokumenService;
