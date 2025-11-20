import { Router } from 'express';
import SiswaController from '../controllers/siswa.controller';
import { createSiswaValidation } from '../middleware/validation/siswa.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class SiswaRouter {
  private route: Router;
  private siswaController: SiswaController;

  constructor() {
    this.route = Router();
    this.siswaController = new SiswaController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createSiswaValidation,
      this.siswaController.create
    );

    // Read All - Admin only
    this.route.get(
      '/',
      authMiddleware,
      adminGuard,
      this.siswaController.getAll
    );

    // Read One - Admin only
    this.route.get(
      '/:id',
      authMiddleware,
      adminGuard,
      this.siswaController.getById
    );

    // Update - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      this.siswaController.update
    );

    // Delete - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.siswaController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SiswaRouter;