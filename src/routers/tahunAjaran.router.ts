import { Router } from 'express';
import TahunAjaranController from '../controllers/tahunAjaran.controller';
import { createTahunAjaranValidation } from '../middleware/validation/tahunAjaran.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class TahunAjaranRouter {
  private route: Router;
  private tahunAjaranController: TahunAjaranController;

  constructor() {
    this.route = Router();
    this.tahunAjaranController = new TahunAjaranController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createTahunAjaranValidation,
      this.tahunAjaranController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TahunAjaranRouter;