import { Router } from 'express';
import KelasController from '../controllers/kelas.controller';
import { createKelasValidation } from '../middleware/validation/kelas.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class KelasRouter {
  private route: Router;
  private kelasController: KelasController;

  constructor() {
    this.route = Router();
    this.kelasController = new KelasController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createKelasValidation,
      this.kelasController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default KelasRouter;