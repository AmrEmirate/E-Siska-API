"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuruRepo = exports.updateGuruRepo = exports.getGuruByIdRepo = exports.getAllGuruRepo = exports.createGuruRepo = void 0;
const prisma_1 = require("../config/prisma");
const createGuruRepo = async (data) => {
    const { nip, nama, email, username, passwordHash, role, jenisKelamin, agama, tempatLahir, tanggalLahir, noTelp, nik, nuptk, statusKepegawaian, alamat, isAktif, } = data;
    try {
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    username: username,
                    passwordHash: passwordHash,
                    role: role,
                },
            });
            const newGuru = await tx.guru.create({
                data: {
                    nip: nip,
                    nama: nama,
                    email: email,
                    userId: newUser.id,
                    jenisKelamin,
                    agama,
                    tempatLahir,
                    tanggalLahir,
                    noTelp,
                    nik,
                    nuptk,
                    statusKepegawaian,
                    alamat,
                    isAktif,
                },
            });
            return { user: newUser, guru: newGuru };
        });
        const { passwordHash: _, ...safeUser } = result.user;
        return { user: safeUser, guru: result.guru };
    }
    catch (error) {
        throw error;
    }
};
exports.createGuruRepo = createGuruRepo;
const getAllGuruRepo = async (skip, take) => {
    return prisma_1.prisma.guru.findMany({
        skip: skip || 0,
        take: take || 100,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                    isWaliKelas: true,
                },
            },
            KelasBimbingan: true,
        },
        orderBy: {
            nama: "asc",
        },
    });
};
exports.getAllGuruRepo = getAllGuruRepo;
const getGuruByIdRepo = async (id) => {
    return prisma_1.prisma.guru.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                    isWaliKelas: true,
                },
            },
            KelasBimbingan: true,
            Penugasan: {
                include: {
                    mapel: true,
                    kelas: true,
                },
            },
        },
    });
};
exports.getGuruByIdRepo = getGuruByIdRepo;
const updateGuruRepo = async (id, data) => {
    return prisma_1.prisma.guru.update({
        where: { id },
        data: {
            ...(data.nip && { nip: data.nip }),
            ...(data.nama && { nama: data.nama }),
            ...(data.email !== undefined && { email: data.email }),
            ...(data.jenisKelamin && { jenisKelamin: data.jenisKelamin }),
            ...(data.agama && { agama: data.agama }),
            ...(data.tempatLahir && { tempatLahir: data.tempatLahir }),
            ...(data.tanggalLahir && { tanggalLahir: data.tanggalLahir }),
            ...(data.noTelp && { noTelp: data.noTelp }),
            ...(data.nik && { nik: data.nik }),
            ...(data.nuptk && { nuptk: data.nuptk }),
            ...(data.statusKepegawaian && {
                statusKepegawaian: data.statusKepegawaian,
            }),
            ...(data.alamat && { alamat: data.alamat }),
            ...(data.isAktif !== undefined && { isAktif: data.isAktif }),
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
exports.updateGuruRepo = updateGuruRepo;
const deleteGuruRepo = async (id) => {
    return prisma_1.prisma.guru.delete({
        where: { id },
    });
};
exports.deleteGuruRepo = deleteGuruRepo;
