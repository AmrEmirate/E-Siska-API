import { Router } from 'express';
import CapaianController from '../controllers/capaian.controller';
import { inputCapaianValidation } from '../middleware/validation/capaian.validation';

class CapaianRouter {
  private route: Router;
  private capaianController: CapaianController;

  constructor() {
    this.route = Router();
    this.capaianController = new CapaianController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      inputCapaianValidation,
      this.capaianController.inputCapaian
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default CapaianRouter;