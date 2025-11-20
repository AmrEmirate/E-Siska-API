import { Request, Response, NextFunction } from "express";
import { inputCapaianService } from "../service/capaian.service";
import logger from "../utils/logger";

class CapaianController {
  public async inputCapaian(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, mapelId, data } = req.body;

      const result = await inputCapaianService({
        guruId,
        mapelId,
        data,
      });

      res.status(200).send({
        success: true,
        message: "Capaian kompetensi berhasil disimpan",
        totalData: result.length,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error input capaian: ${error.message}`);
      }
      next(error);
    }
  }
}

export default CapaianController;
