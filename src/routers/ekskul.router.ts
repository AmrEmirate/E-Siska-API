import { Router } from 'express';
import EkskulController from '../controllers/ekskul.controller';
import { inputEkskulValidation } from '../middleware/validation/ekskul.validation';
import { authMiddleware, guruGuard } from '../middleware/auth.middleware';

class EkskulRouter {
  private route: Router;
  private ekskulController: EkskulController;

  constructor() {
    this.route = Router();
    this.ekskulController = new EkskulController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Input nilai ekstrakurikuler - Guru only
    this.route.post(
      '/ekskul',
      authMiddleware,
      guruGuard,
      inputEkskulValidation,
      this.ekskulController.inputNilai
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default EkskulRouter;