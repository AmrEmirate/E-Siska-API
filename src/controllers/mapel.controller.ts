import { Request, Response, NextFunction } from "express";
import { createMapelService } from "../service/mapel.service";
import logger from "../utils/logger";

class MapelController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaMapel, kategori } = req.body;

      const result = await createMapelService({
        namaMapel,
        kategori,
      });

      res.status(201).send({
        success: true,
        message: "Mata pelajaran dan skema (kosong) berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create mapel: ${error.message}`);
      }
      next(error);
    }
  }
}

export default MapelController;