"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSiswaService = exports.updateSiswaService = exports.getSiswaByIdService = exports.getAllSiswaService = exports.createSiswaService = void 0;
const prisma_1 = require("../generated/prisma");
const prisma_2 = require("../config/prisma");
const siswa_repository_1 = require("../repositories/siswa.repository");
const AppError_1 = __importDefault(require("../utils/AppError"));
const hashPassword_1 = require("../utils/hashPassword");
const logger_1 = __importDefault(require("../utils/logger"));
const createSiswaService = async (data) => {
    const { nis, nama, tanggalLahir, alamat } = data;
    const username = nis;
    if (nis.length < 6) {
        throw new AppError_1.default("NIS harus memiliki minimal 6 digit", 400);
    }
    const defaultPassword = nis.slice(-6);
    const passwordHash = await (0, hashPassword_1.hashPassword)(defaultPassword);
    logger_1.default.info(`Password default dibuat untuk NIS: ${nis}`);
    const repoInput = {
        nis,
        nisn: data.nisn,
        nama,
        jenisKelamin: data.jenisKelamin,
        agama: data.agama,
        tempatLahir: data.tempatLahir,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
        pendidikanSebelumnya: data.pendidikanSebelumnya,
        alamat,
        namaAyah: data.namaAyah,
        pekerjaanAyah: data.pekerjaanAyah,
        namaIbu: data.namaIbu,
        pekerjaanIbu: data.pekerjaanIbu,
        alamatOrtu: data.alamatOrtu,
        namaWali: data.namaWali,
        pekerjaanWali: data.pekerjaanWali,
        alamatWali: data.alamatWali,
        status: data.status,
        nik: data.nik,
        username,
        passwordHash,
        role: prisma_1.UserRole.SISWA,
    };
    const newSiswaData = await (0, siswa_repository_1.createSiswaRepo)(repoInput);
    return newSiswaData;
};
exports.createSiswaService = createSiswaService;
const getAllSiswaService = async (page = 1, limit = 50) => {
    const skip = (page - 1) * limit;
    const take = limit;
    logger_1.default.info(`Fetching all siswa - Page: ${page}, Limit: ${limit}`);
    const students = await (0, siswa_repository_1.getAllSiswaRepo)(skip, take);
    const total = await prisma_2.prisma.siswa.count();
    return {
        data: students,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getAllSiswaService = getAllSiswaService;
const getSiswaByIdService = async (id) => {
    logger_1.default.info(`Fetching siswa by ID: ${id}`);
    const siswa = await (0, siswa_repository_1.getSiswaByIdRepo)(id);
    if (!siswa) {
        throw new AppError_1.default("Siswa tidak ditemukan", 404);
    }
    return siswa;
};
exports.getSiswaByIdService = getSiswaByIdService;
const updateSiswaService = async (id, data) => {
    logger_1.default.info(`Updating siswa: ${id}`);
    const existingSiswa = await (0, siswa_repository_1.getSiswaByIdRepo)(id);
    if (!existingSiswa) {
        throw new AppError_1.default("Siswa tidak ditemukan", 404);
    }
    const updateData = {};
    if (data.nis)
        updateData.nis = data.nis;
    if (data.nisn)
        updateData.nisn = data.nisn;
    if (data.nama)
        updateData.nama = data.nama;
    if (data.jenisKelamin)
        updateData.jenisKelamin = data.jenisKelamin;
    if (data.agama)
        updateData.agama = data.agama;
    if (data.tempatLahir)
        updateData.tempatLahir = data.tempatLahir;
    if (data.tanggalLahir)
        updateData.tanggalLahir = new Date(data.tanggalLahir);
    if (data.pendidikanSebelumnya)
        updateData.pendidikanSebelumnya = data.pendidikanSebelumnya;
    if (data.alamat !== undefined)
        updateData.alamat = data.alamat;
    if (data.namaAyah)
        updateData.namaAyah = data.namaAyah;
    if (data.pekerjaanAyah)
        updateData.pekerjaanAyah = data.pekerjaanAyah;
    if (data.namaIbu)
        updateData.namaIbu = data.namaIbu;
    if (data.pekerjaanIbu)
        updateData.pekerjaanIbu = data.pekerjaanIbu;
    if (data.alamatOrtu)
        updateData.alamatOrtu = data.alamatOrtu;
    if (data.namaWali)
        updateData.namaWali = data.namaWali;
    if (data.pekerjaanWali)
        updateData.pekerjaanWali = data.pekerjaanWali;
    if (data.alamatWali)
        updateData.alamatWali = data.alamatWali;
    if (data.status)
        updateData.status = data.status;
    if (data.nik)
        updateData.nik = data.nik;
    const updatedSiswa = await (0, siswa_repository_1.updateSiswaRepo)(id, updateData);
    return updatedSiswa;
};
exports.updateSiswaService = updateSiswaService;
const deleteSiswaService = async (id) => {
    logger_1.default.info(`Deleting siswa: ${id}`);
    const existingSiswa = await (0, siswa_repository_1.getSiswaByIdRepo)(id);
    if (!existingSiswa) {
        throw new AppError_1.default("Siswa tidak ditemukan", 404);
    }
    await (0, siswa_repository_1.deleteSiswaRepo)(id);
    return { message: "Siswa berhasil dihapus" };
};
exports.deleteSiswaService = deleteSiswaService;
