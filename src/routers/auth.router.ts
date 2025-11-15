import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { uploaderMemory } from '../middleware/uploader';
import { loginValidation } from '../middleware/validation/auth'; // Impor validasi

class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Rute Login Baru
    // (Catatan: loginValidation masih pakai 'email', perlu diubah ke 'username' di file validasinya)
    this.route.post(
      '/signin',
      // loginValidation, // Aktifkan setelah validasi diperbarui
      this.authController.login
    );

    // Rute yang sudah ada
    this.route.patch(
      '/profile-img',
      uploaderMemory().single('img'), // 'img' adalah nama field di form-data
      this.authController.changeProfileImg
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;