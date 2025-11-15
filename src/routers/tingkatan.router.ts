import { Router } from 'express';
import TingkatanController from '../controllers/tingkatan.controller';
import { createTingkatanValidation } from '../middleware/validation/tingkatan.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class TingkatanRouter {
  private route: Router;
  private tingkatanController: TingkatanController;

  constructor() {
    this.route = Router();
    this.tingkatanController = new TingkatanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createTingkatanValidation,
      this.tingkatanController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TingkatanRouter;