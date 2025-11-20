import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { cloudinaryUpload } from '../config/cloudinary';
import { loginService } from '../service/auth.service'; 
import AppError from '../utils/AppError'; 

class AuthController {
  
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

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // For stateless JWT, logout is handled on client side
      // This endpoint is mainly for consistency and can be used for token blacklist in future
      res.status(200).send({
        success: true,
        message: "Logout berhasil",
      });
    } catch (error) {
      next(error);
    }
  }

  public async changeProfileImg(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw { code: 400, message: "No file uploaded" };
      }
      const upload = await cloudinaryUpload(req.file);

      // TODO: Get userId from req.user after auth middleware is enabled
      const userId = req.user?.id || "USER_ID_DARI_TOKEN"; 

      res.status(200).send({
        success: true,
        message: "Change image profile success",
        imageUrl: upload.secure_url
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
