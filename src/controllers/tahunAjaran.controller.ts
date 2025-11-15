import { Request, Response, NextFunction } from "express";
import { createTahunAjaranService } from "../service/tahunAjaran.service";
import logger from "../utils/logger";

class TahunAjaranController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nama } = req.body;

      const result = await createTahunAjaranService({
        nama,
      });

      res.status(201).send({
        success: true,
        message: "Tahun Ajaran berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create Tahun Ajaran: ${error.message}`);
      }
      next(error);
    }
  }
}

export default TahunAjaranController;