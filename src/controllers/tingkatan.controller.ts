import { Request, Response, NextFunction } from "express";
import { createTingkatanService } from "../service/tingkatan.service";
import logger from "../utils/logger";

class TingkatanController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaTingkat } = req.body;

      const result = await createTingkatanService(namaTingkat);

      res.status(201).send({
        success: true,
        message: "Tingkatan kelas berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create tingkatan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default TingkatanController;