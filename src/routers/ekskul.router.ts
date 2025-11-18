import { Router } from 'express';
import EkskulController from '../controllers/ekskul.controller';
import { inputEkskulValidation } from '../middleware/validation/ekskul.validation';

class EkskulRouter {
  private route: Router;
  private ekskulController: EkskulController;

  constructor() {
    this.route = Router();
    this.ekskulController = new EkskulController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Endpoint khusus untuk nilai ekskul
    // Menggunakan path /nilai/ekskul agar terpisah logikanya dari /nilai biasa
    this.route.post(
      '/ekskul', // Jadi url lengkapnya: POST /nilai/ekskul (jika di-mount di app.ts) atau buat root baru
      inputEkskulValidation,
      this.ekskulController.inputNilai
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default EkskulRouter;