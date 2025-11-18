import { Router } from 'express';
import AbsensiController from '../controllers/absensi.controller';
import { createSesiValidation } from '../middleware/validation/absensi.validation';
// import { authMiddleware } from '../middleware/auth.middleware';

class AbsensiRouter {
  private route: Router;
  private absensiController: AbsensiController;

  constructor() {
    this.route = Router();
    this.absensiController = new AbsensiController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // 1. Buat Sesi Pertemuan
    this.route.post(
      '/sesi',
      // authMiddleware, // (Nanti)
      createSesiValidation,
      this.absensiController.createSesi
    );

    // (Nanti kita tambahkan route untuk input detail kehadiran di sini)
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AbsensiRouter;