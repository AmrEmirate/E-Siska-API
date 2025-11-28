"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrGuruGuard = exports.waliKelasGuard = exports.siswaGuard = exports.guruGuard = exports.adminGuard = exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = require("../generated/prisma");
const prisma_2 = require("../config/prisma");
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AppError_1.default("Token tidak ditemukan. Silakan login terlebih dahulu.", 401);
        }
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : authHeader;
        if (!token) {
            throw new AppError_1.default("Token tidak valid.", 401);
        }
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        let userData = {
            id: decoded.id,
            role: decoded.role,
        };
        if (decoded.role === prisma_1.UserRole.ADMIN) {
            const admin = await prisma_2.prisma.admin.findUnique({
                where: { userId: decoded.id },
                select: { id: true },
            });
            if (admin) {
                userData.adminId = admin.id;
            }
        }
        else if (decoded.role === prisma_1.UserRole.GURU) {
            const guru = await prisma_2.prisma.guru.findUnique({
                where: { userId: decoded.id },
                select: { id: true },
            });
            if (guru) {
                userData.guruId = guru.id;
            }
        }
        else if (decoded.role === prisma_1.UserRole.SISWA) {
            const siswa = await prisma_2.prisma.siswa.findUnique({
                where: { userId: decoded.id },
                select: { id: true },
            });
            if (siswa) {
                userData.siswaId = siswa.id;
            }
        }
        req.user = userData;
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(new AppError_1.default("Token tidak valid.", 401));
        }
        if (error.name === "TokenExpiredError") {
            return next(new AppError_1.default("Token sudah kadaluarsa. Silakan login kembali.", 401));
        }
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const adminGuard = (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.default("Unauthorized. Silakan login terlebih dahulu.", 401));
    }
    if (req.user.role !== prisma_1.UserRole.ADMIN) {
        return next(new AppError_1.default("Akses ditolak. Hanya Admin yang dapat mengakses.", 403));
    }
    next();
};
exports.adminGuard = adminGuard;
const guruGuard = (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.default("Unauthorized. Silakan login terlebih dahulu.", 401));
    }
    if (req.user.role !== prisma_1.UserRole.GURU) {
        return next(new AppError_1.default("Akses ditolak. Hanya Guru yang dapat mengakses.", 403));
    }
    next();
};
exports.guruGuard = guruGuard;
const siswaGuard = (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.default("Unauthorized. Silakan login terlebih dahulu.", 401));
    }
    if (req.user.role !== prisma_1.UserRole.SISWA) {
        return next(new AppError_1.default("Akses ditolak. Hanya Siswa yang dapat mengakses.", 403));
    }
    next();
};
exports.siswaGuard = siswaGuard;
const waliKelasGuard = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError_1.default("Unauthorized. Silakan login terlebih dahulu.", 401));
        }
        if (req.user.role !== prisma_1.UserRole.GURU) {
            return next(new AppError_1.default("Akses ditolak. Hanya Guru yang dapat mengakses.", 403));
        }
        const guru = await prisma_2.prisma.guru.findUnique({
            where: { id: req.user.guruId },
            include: {
                KelasBimbingan: true,
            },
        });
        if (!guru || !guru.KelasBimbingan) {
            return next(new AppError_1.default("Akses ditolak. Hanya Wali Kelas yang dapat mengakses.", 403));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.waliKelasGuard = waliKelasGuard;
const adminOrGuruGuard = (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.default("Unauthorized. Silakan login terlebih dahulu.", 401));
    }
    if (req.user.role !== prisma_1.UserRole.ADMIN && req.user.role !== prisma_1.UserRole.GURU) {
        return next(new AppError_1.default("Akses ditolak. Hanya Admin atau Guru yang dapat mengakses.", 403));
    }
    next();
};
exports.adminOrGuruGuard = adminOrGuruGuard;
