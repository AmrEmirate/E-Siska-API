import { Router } from "express";
import BackupController from "../controllers/backup.controller";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";
import { uploaderMemory } from "../middleware/uploader";

class BackupRouter {
  private route: Router;
  private backupController: BackupController;

  constructor() {
    this.route = Router();
    this.backupController = new BackupController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get(
      "/download",
      authMiddleware,
      adminGuard,
      this.backupController.create
    );

    this.route.post(
      "/restore",
      authMiddleware,
      adminGuard,
      uploaderMemory(50 * 1024 * 1024).single("file"),
      this.backupController.restore
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default BackupRouter;
