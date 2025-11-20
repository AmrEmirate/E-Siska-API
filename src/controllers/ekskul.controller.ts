import { Request, Response, NextFunction } from "express";
import { inputNilaiEkskulService } from "../service/ekskul.service";
import logger from "../utils/logger";

class EkskulController {
  public async inputNilai(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, mapelId, data } = req.body;

      const result = await inputNilaiEkskulService({
        guruId,
        mapelId,
        data,
      });

      res.status(200).send({
        success: true,
        message: "Nilai ekstrakurikuler berhasil disimpan",
        totalData: result.length,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error input ekskul: ${error.message}`);
      }
      next(error);
    }
  }
}

export default EkskulController;
