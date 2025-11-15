import { Router } from 'express';
import SiswaController from '../controllers/siswa.controller';
import { createSiswaValidation } from '../middleware/validation/siswa.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware'; // (Akan dibuat nanti)

class SiswaRouter {
  private route: Router;
  private siswaController: SiswaController;

  constructor() {
    this.route = Router();
    this.siswaController = new SiswaController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createSiswaValidation, // Terapkan validasi
      this.siswaController.create
    );

    // (Nanti kita tambahkan route lain: GET /, GET /:id, PATCH /:id, DELETE /:id)
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SiswaRouter;