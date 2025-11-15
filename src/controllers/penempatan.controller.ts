import { Request, Response, NextFunction } from "express";
import { createPenempatanService } from "../service/penempatan.service";
import logger from "../utils/logger";

class PenempatanController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId, kelasId, tahunAjaranId } = req.body;

      const result = await createPenempatanService({
        siswaId,
        kelasId,
        tahunAjaranId,
      });

      res.status(201).send({
        success: true,
        message: "Siswa berhasil ditempatkan di kelas",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create penempatan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default PenempatanController;