import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../utils/AppError";
import { UserRole } from "../generated/prisma";
import { prisma } from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        adminId?: string;
        guruId?: string;
        siswaId?: string;
      };
    }
  }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user data to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError("Token tidak ditemukan. Silakan login terlebih dahulu.", 401);
    }

    // Expected format: "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      throw new AppError("Token tidak valid.", 401);
    }

    // 2. Verify token
    const decoded = verify(token, JWT_SECRET) as {
      id: string;
      role: UserRole;
    };

    // 3. Get full user data based on role
    let userData: any = {
      id: decoded.id,
      role: decoded.role,
    };

    // Fetch role-specific IDs
    if (decoded.role === UserRole.ADMIN) {
      const admin = await prisma.admin.findUnique({
        where: { userId: decoded.id },
        select: { id: true },
      });
      if (admin) {
        userData.adminId = admin.id;
      }
    } else if (decoded.role === UserRole.GURU) {
      const guru = await prisma.guru.findUnique({
        where: { userId: decoded.id },
        select: { id: true },
      });
      if (guru) {
        userData.guruId = guru.id;
      }
    } else if (decoded.role === UserRole.SISWA) {
      const siswa = await prisma.siswa.findUnique({
        where: { userId: decoded.id },
        select: { id: true },
      });
      if (siswa) {
        userData.siswaId = siswa.id;
      }
    }

    // 4. Attach to request
    req.user = userData;

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Token tidak valid.", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token sudah kadaluarsa. Silakan login kembali.", 401));
    }
    next(error);
  }
};

/**
 * Admin Guard - Only allows ADMIN role
 */
export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Unauthorized. Silakan login terlebih dahulu.", 401));
  }

  if (req.user.role !== UserRole.ADMIN) {
    return next(new AppError("Akses ditolak. Hanya Admin yang dapat mengakses.", 403));
  }

  next();
};

/**
 * Guru Guard - Only allows GURU role
 */
export const guruGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Unauthorized. Silakan login terlebih dahulu.", 401));
  }

  if (req.user.role !== UserRole.GURU) {
    return next(new AppError("Akses ditolak. Hanya Guru yang dapat mengakses.", 403));
  }

  next();
};

/**
 * Siswa Guard - Only allows SISWA role
 */
export const siswaGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Unauthorized. Silakan login terlebih dahulu.", 401));
  }

  if (req.user.role !== UserRole.SISWA) {
    return next(new AppError("Akses ditolak. Hanya Siswa yang dapat mengakses.", 403));
  }

  next();
};

/**
 * Wali Kelas Guard - Only allows GURU who is a wali kelas
 */
export const waliKelasGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError("Unauthorized. Silakan login terlebih dahulu.", 401));
    }

    if (req.user.role !== UserRole.GURU) {
      return next(new AppError("Akses ditolak. Hanya Guru yang dapat mengakses.", 403));
    }

    // Check if guru has a class assignment (is wali kelas)
    const guru = await prisma.guru.findUnique({
      where: { id: req.user.guruId },
      include: {
        KelasBimbingan: true,
      },
    });

    if (!guru || !guru.KelasBimbingan) {
      return next(
        new AppError("Akses ditolak. Hanya Wali Kelas yang dapat mengakses.", 403)
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Admin or Guru Guard - Allows both ADMIN and GURU roles
 */
export const adminOrGuruGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError("Unauthorized. Silakan login terlebih dahulu.", 401));
  }

  if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.GURU) {
    return next(new AppError("Akses ditolak. Hanya Admin atau Guru yang dapat mengakses.", 403));
  }

  next();
};
