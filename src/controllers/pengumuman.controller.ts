import { Request, Response, NextFunction } from "express";
import { createPengumumanService } from "../service/pengumuman.service";
import logger from "../utils/logger";

class PengumumanController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { judul, konten } = req.body;

      const result = await createPengumumanService({
        judul,
        konten,
      });

      res.status(201).send({
        success: true,
        message: "Pengumuman berhasil dibuat",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create pengumuman: ${error.message}`);
      }
      next(error);
    }
  }
}

export default PengumumanController;