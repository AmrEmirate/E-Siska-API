import { Router } from 'express';
import PenempatanController from '../controllers/penempatan.controller';
import { createPenempatanValidation } from '../middleware/validation/penempatan.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PenempatanRouter {
  private route: Router;
  private penempatanController: PenempatanController;

  constructor() {
    this.route = Router();
    this.penempatanController = new PenempatanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createPenempatanValidation,
      this.penempatanController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PenempatanRouter;