"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSiswaRepo = exports.updateSiswaRepo = exports.getSiswaByIdRepo = exports.getAllSiswaRepo = exports.createSiswaRepo = void 0;
const prisma_1 = require("../config/prisma");
const createSiswaRepo = async (data) => {
    const { nis, nisn, nama, jenisKelamin, agama, tempatLahir, tanggalLahir, pendidikanSebelumnya, alamat, namaAyah, pekerjaanAyah, namaIbu, pekerjaanIbu, alamatOrtu, namaWali, pekerjaanWali, alamatWali, status, nik, username, passwordHash, role, } = data;
    try {
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    username: username,
                    passwordHash: passwordHash,
                    role: role,
                },
            });
            const newSiswa = await tx.siswa.create({
                data: {
                    nis,
                    nisn,
                    nama,
                    jenisKelamin,
                    agama,
                    tempatLahir,
                    tanggalLahir,
                    pendidikanSebelumnya,
                    alamat,
                    namaAyah,
                    pekerjaanAyah,
                    namaIbu,
                    pekerjaanIbu,
                    alamatOrtu,
                    namaWali,
                    pekerjaanWali,
                    alamatWali,
                    status,
                    nik,
                    userId: newUser.id,
                },
            });
            return { user: newUser, siswa: newSiswa };
        });
        const { passwordHash: _, ...safeUser } = result.user;
        return { user: safeUser, siswa: result.siswa };
    }
    catch (error) {
        throw error;
    }
};
exports.createSiswaRepo = createSiswaRepo;
const getAllSiswaRepo = async (skip, take) => {
    return prisma_1.prisma.siswa.findMany({
        skip: skip || 0,
        take: take || 100,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                },
            },
        },
        orderBy: {
            nama: "asc",
        },
    });
};
exports.getAllSiswaRepo = getAllSiswaRepo;
const getSiswaByIdRepo = async (id) => {
    return prisma_1.prisma.siswa.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                },
            },
            Penempatan: {
                include: {
                    kelas: true,
                    tahunAjaran: true,
                },
            },
        },
    });
};
exports.getSiswaByIdRepo = getSiswaByIdRepo;
const updateSiswaRepo = async (id, data) => {
    return prisma_1.prisma.siswa.update({
        where: { id },
        data: {
            ...(data.nis && { nis: data.nis }),
            ...(data.nisn && { nisn: data.nisn }),
            ...(data.nama && { nama: data.nama }),
            ...(data.jenisKelamin && { jenisKelamin: data.jenisKelamin }),
            ...(data.agama && { agama: data.agama }),
            ...(data.tempatLahir && { tempatLahir: data.tempatLahir }),
            ...(data.tanggalLahir !== undefined && {
                tanggalLahir: data.tanggalLahir,
            }),
            ...(data.pendidikanSebelumnya && {
                pendidikanSebelumnya: data.pendidikanSebelumnya,
            }),
            ...(data.alamat !== undefined && { alamat: data.alamat }),
            ...(data.namaAyah && { namaAyah: data.namaAyah }),
            ...(data.pekerjaanAyah && { pekerjaanAyah: data.pekerjaanAyah }),
            ...(data.namaIbu && { namaIbu: data.namaIbu }),
            ...(data.pekerjaanIbu && { pekerjaanIbu: data.pekerjaanIbu }),
            ...(data.alamatOrtu && { alamatOrtu: data.alamatOrtu }),
            ...(data.namaWali && { namaWali: data.namaWali }),
            ...(data.pekerjaanWali && { pekerjaanWali: data.pekerjaanWali }),
            ...(data.alamatWali && { alamatWali: data.alamatWali }),
            ...(data.status && { status: data.status }),
            ...(data.nik && { nik: data.nik }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                },
            },
        },
    });
};
exports.updateSiswaRepo = updateSiswaRepo;
const deleteSiswaRepo = async (id) => {
    return prisma_1.prisma.siswa.delete({
        where: { id },
    });
};
exports.deleteSiswaRepo = deleteSiswaRepo;
