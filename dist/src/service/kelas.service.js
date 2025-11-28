"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyTeachingClassesService = exports.getMyClassService = exports.getAllKelasService = exports.deleteKelasService = exports.updateKelasService = exports.createKelasService = void 0;
const kelas_repository_1 = require("../repositories/kelas.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../config/prisma");
const createKelasService = async (data) => {
    logger_1.default.info(`Mencoba membuat kelas: ${data.namaKelas}`);
    const tingkatan = await prisma_1.prisma.tingkatanKelas.findUnique({
        where: { id: data.tingkatanId },
    });
    if (!tingkatan) {
        throw new AppError_1.default("Tingkatan Kelas tidak ditemukan", 404);
    }
    if (data.waliKelasId) {
        const guru = await prisma_1.prisma.guru.findUnique({
            where: { id: data.waliKelasId },
        });
        if (!guru) {
            throw new AppError_1.default("Guru (calon Wali Kelas) tidak ditemukan", 404);
        }
    }
    const newKelas = await (0, kelas_repository_1.createKelasRepo)(data);
    return newKelas;
};
exports.createKelasService = createKelasService;
const updateKelasService = async (id, data) => {
    logger_1.default.info(`Mencoba update kelas: ${id}`);
    if (data.waliKelasId) {
        const guru = await prisma_1.prisma.guru.findUnique({
            where: { id: data.waliKelasId },
        });
        if (!guru) {
            throw new AppError_1.default("Guru (calon Wali Kelas) tidak ditemukan", 404);
        }
    }
    return await (0, kelas_repository_1.updateKelasRepo)(id, data);
};
exports.updateKelasService = updateKelasService;
const deleteKelasService = async (id) => {
    logger_1.default.info(`Mencoba hapus kelas: ${id}`);
    return await (0, kelas_repository_1.deleteKelasRepo)(id);
};
exports.deleteKelasService = deleteKelasService;
const getAllKelasService = async () => {
    logger_1.default.info("Fetching all kelas");
    return await (0, kelas_repository_1.findAllKelasRepo)();
};
exports.getAllKelasService = getAllKelasService;
const getMyClassService = async (guruId) => {
    logger_1.default.info(`Fetching class for wali kelas: ${guruId}`);
    const kelas = await (0, kelas_repository_1.getKelasByWaliKelasRepo)(guruId);
    if (!kelas) {
        throw new AppError_1.default("Anda tidak terdaftar sebagai Wali Kelas untuk kelas manapun.", 404);
    }
    return kelas;
};
exports.getMyClassService = getMyClassService;
const getMyTeachingClassesService = async (guruId) => {
    logger_1.default.info(`Fetching teaching classes for guru: ${guruId}`);
    return await (0, kelas_repository_1.getKelasByGuruIdRepo)(guruId);
};
exports.getMyTeachingClassesService = getMyTeachingClassesService;
