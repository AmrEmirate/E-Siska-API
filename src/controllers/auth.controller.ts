import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { cloudinaryUpload } from '../config/cloudinary';
import { loginService } from '../service/auth.service'; // Impor loginService
import AppError from '../utils/AppError'; // Impor AppError

class AuthController {
  // Fungsi login baru
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new AppError("Username dan password dibutuhkan", 400);
      }

      const result = await loginService({ username, password });

      res.status(200).send({
        success: true,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Fungsi changeProfileImg yang sudah ada
  public async changeProfileImg(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw { code: 400, message: "No file uploaded" };
      }
      const upload = await cloudinaryUpload(req.file);

      // PERHATIKAN: Skema menggunakan 'User', bukan 'Accounts'.
      // Logika ini perlu disesuaikan dengan siapa yang sedang login (didapat dari token)
      // Untuk saat ini, kita biarkan dulu, tapi ini perlu diperbaiki nanti.
      const userId = "USER_ID_DARI_TOKEN"; // Contoh, harusnya didapat dari auth middleware
      
      // Menggunakan prisma.user (contoh update data guru)
      // Logika ini harus disesuaikan, mungkin user ingin update data Guru/Admin/Siswa?
      // schema.prisma tidak punya 'profile_img' di model User, Guru, atau Siswa.
      // Kita harus menambahkannya ke schema.prisma jika fitur ini diperlukan.
      
      /*
      await prisma.user.update({
        where: { id: userId },
        data: { profile_img: upload.secure_url }, // 'profile_img' BELUM ADA di schema.prisma
      });
      */

      res.status(200).send({
        success: true,
        message: "Change image profile success (CONTOH, SKEMA PERLU UPDATE)",
        imageUrl: upload.secure_url
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;