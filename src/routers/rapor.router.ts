import { Router } from 'express';
import RaporController from '../controllers/rapor.controller';
import { inputRaporValidation, generateRaporValidation } from '../middleware/validation/rapor.validation'; // Import baru

class RaporRouter {
  private route: Router;
  private raporController: RaporController;

  constructor() {
    this.route = Router();
    this.raporController = new RaporController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Update Data Rapor
    this.route.put(
      '/siswa/:siswaId',
      inputRaporValidation,
      this.raporController.updateDataRapor
    );

    // Generate / Preview Rapor
    this.route.post( // Menggunakan POST untuk mengirim filter (TA/GuruID) di body
      '/siswa/:siswaId/generate',
      generateRaporValidation,
      this.raporController.generate
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default RaporRouter;