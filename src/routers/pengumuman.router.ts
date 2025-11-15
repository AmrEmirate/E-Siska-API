import { Router } from 'express';
import PengumumanController from '../controllers/pengumuman.controller';
import { createPengumumanValidation } from '../middleware/validation/pengumuman.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PengumumanRouter {
  private route: Router;
  private pengumumanController: PengumumanController;

  constructor() {
    this.route = Router();
    this.pengumumanController = new PengumumanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createPengumumanValidation,
      this.pengumumanController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PengumumanRouter;