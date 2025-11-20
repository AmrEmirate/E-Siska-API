import { Router } from 'express';
import PenempatanController from '../controllers/penempatan.controller';
import { createPenempatanValidation } from '../middleware/validation/penempatan.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PenempatanRouter {
  private route: Router;
  private penempatanController: PenempatanController;

  constructor() {
    this.route = Router();
    this.penempatanController = new PenempatanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create pen empatan - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createPenempatanValidation,
      this.penempatanController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PenempatanRouter;