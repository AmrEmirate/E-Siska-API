import { Router } from 'express';
import MapelController from '../controllers/mapel.controller';
import { createMapelValidation } from '../middleware/validation/mapel.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class MapelRouter {
  private route: Router;
  private mapelController: MapelController;

  constructor() {
    this.route = Router();
    this.mapelController = new MapelController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createMapelValidation,
      this.mapelController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default MapelRouter;