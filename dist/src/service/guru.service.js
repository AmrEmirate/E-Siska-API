"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuruService = exports.updateGuruService = exports.getGuruByIdService = exports.getAllGuruService = exports.createGuruService = void 0;
const prisma_1 = require("../generated/prisma");
const prisma_2 = require("../config/prisma");
const guru_repository_1 = require("../repositories/guru.repository");
const hashPassword_1 = require("../utils/hashPassword");
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const createGuruService = async (data) => {
    const { nip, nama, email, username } = data;
    let passwordToHash = data.passwordDefault;
    if (!passwordToHash && nip) {
        passwordToHash = nip.slice(-6);
        logger_1.default.info(`Auto-generated password for guru from NIP: ${nip} -> last 6 digits`);
    }
    if (!passwordToHash) {
        throw new AppError_1.default("Password atau NIP harus disediakan", 400);
    }
    const passwordHash = await (0, hashPassword_1.hashPassword)(passwordToHash);
    logger_1.default.info(`Password di-hash untuk user guru baru: ${username}`);
    const repoInput = {
        nip,
        nama,
        email,
        username,
        passwordHash,
        role: prisma_1.UserRole.GURU,
        jenisKelamin: data.jenisKelamin,
        agama: data.agama,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : undefined,
        noTelp: data.noTelp,
        nik: data.nik,
        nuptk: data.nuptk,
        statusKepegawaian: data.statusKepegawaian,
        alamat: data.alamat,
        isAktif: data.isAktif,
    };
    const newGuruData = await (0, guru_repository_1.createGuruRepo)(repoInput);
    return newGuruData;
};
exports.createGuruService = createGuruService;
const getAllGuruService = async (page = 1, limit = 50) => {
    const skip = (page - 1) * limit;
    const take = limit;
    logger_1.default.info(`Fetching all guru - Page: ${page}, Limit: ${limit}`);
    const teachers = await (0, guru_repository_1.getAllGuruRepo)(skip, take);
    const total = await prisma_2.prisma.guru.count();
    return {
        data: teachers,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getAllGuruService = getAllGuruService;
const getGuruByIdService = async (id) => {
    logger_1.default.info(`Fetching guru by ID: ${id}`);
    const guru = await (0, guru_repository_1.getGuruByIdRepo)(id);
    if (!guru) {
        throw new AppError_1.default("Guru tidak ditemukan", 404);
    }
    return guru;
};
exports.getGuruByIdService = getGuruByIdService;
const updateGuruService = async (id, data) => {
    logger_1.default.info(`Updating guru: ${id}`);
    const existingGuru = await (0, guru_repository_1.getGuruByIdRepo)(id);
    if (!existingGuru) {
        throw new AppError_1.default("Guru tidak ditemukan", 404);
    }
    const updateData = {};
    if (data.nip)
        updateData.nip = data.nip;
    if (data.nama)
        updateData.nama = data.nama;
    if (data.email !== undefined)
        updateData.email = data.email;
    if (data.jenisKelamin)
        updateData.jenisKelamin = data.jenisKelamin;
    if (data.agama)
        updateData.agama = data.agama;
    if (data.tempatLahir)
        updateData.tempatLahir = data.tempatLahir;
    if (data.tanggalLahir)
        updateData.tanggalLahir = new Date(data.tanggalLahir);
    if (data.noTelp)
        updateData.noTelp = data.noTelp;
    if (data.nik)
        updateData.nik = data.nik;
    if (data.nuptk)
        updateData.nuptk = data.nuptk;
    if (data.statusKepegawaian)
        updateData.statusKepegawaian = data.statusKepegawaian;
    if (data.alamat)
        updateData.alamat = data.alamat;
    if (data.isAktif !== undefined)
        updateData.isAktif = data.isAktif;
    const updatedGuru = await (0, guru_repository_1.updateGuruRepo)(id, updateData);
    return updatedGuru;
};
exports.updateGuruService = updateGuruService;
const deleteGuruService = async (id) => {
    logger_1.default.info(`Deleting guru: ${id}`);
    const existingGuru = await (0, guru_repository_1.getGuruByIdRepo)(id);
    if (!existingGuru) {
        throw new AppError_1.default("Guru tidak ditemukan", 404);
    }
    if (existingGuru.KelasBimbingan) {
        throw new AppError_1.default("Guru masih menjadi wali kelas. Hapus penugasan wali kelas terlebih dahulu.", 400);
    }
    await (0, guru_repository_1.deleteGuruRepo)(id);
    return { message: "Guru berhasil dihapus" };
};
exports.deleteGuruService = deleteGuruService;
