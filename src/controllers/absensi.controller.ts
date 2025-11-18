import { Request, Response, NextFunction } from "express";
import { createSesiService } from "../service/absensi.service";
import logger from "../utils/logger";

class AbsensiController {
  public async createSesi(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, kelasId, tanggal, pertemuanKe } = req.body;

      const result = await createSesiService({
        guruId,
        kelasId,
        tanggal,
        pertemuanKe,
      });

      res.status(201).send({
        success: true,
        message: "Sesi absensi berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create sesi absensi: ${error.message}`);
      }
      next(error);
    }
  }
}

export default AbsensiController;