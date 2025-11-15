import { Request, Response, NextFunction } from "express";
import { createKelasService } from "../service/kelas.service";
import logger from "../utils/logger";

class KelasController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaKelas, tingkatanId, waliKelasId } = req.body;

      const result = await createKelasService({
        namaKelas,
        tingkatanId,
        waliKelasId,
      });

      res.status(201).send({
        success: true,
        message: "Kelas berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create kelas: ${error.message}`);
      }
      next(error);
    }
  }
}

export default KelasController;