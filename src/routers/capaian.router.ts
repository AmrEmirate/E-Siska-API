import { Router } from "express";
import CapaianController from "../controllers/capaian.controller";
import { inputCapaianValidation } from "../middleware/validation/capaian.validation";
import { authMiddleware, guruGuard } from "../middleware/auth.middleware";

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
      "/",
      authMiddleware,
      guruGuard,
      inputCapaianValidation,
      this.capaianController.inputCapaian
    );

    this.route.get(
      "/",
      authMiddleware,
      guruGuard,
      this.capaianController.getCapaian
    );

    this.route.get(
      "/siswa/:siswaId",
      authMiddleware,
      this.capaianController.getCapaianBySiswaId
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default CapaianRouter;
