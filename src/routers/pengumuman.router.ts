import { Router } from 'express';
import PengumumanController from '../controllers/pengumuman.controller';
import { createPengumumanValidation } from '../middleware/validation/pengumuman.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PengumumanRouter {
  private route: Router;
  private pengumumanController: PengumumanController;

  constructor() {
    this.route = Router();
    this.pengumumanController = new PengumumanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create pengumuman - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createPengumumanValidation,
      this.pengumumanController.create
    );

    // List all pengumuman - Admin only
    this.route.get(
      '/',
      authMiddleware,
      adminGuard,
      this.pengumumanController.getAll
    );

    // Get pengumuman by ID - Admin only
    this.route.get(
      '/:id',
      authMiddleware,
      adminGuard,
      this.pengumumanController.getById
    );

    // Update pengumuman - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      createPengumumanValidation,
      this.pengumumanController.update
    );

    // Delete pengumuman - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.pengumumanController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PengumumanRouter;