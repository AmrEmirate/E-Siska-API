import { Request, Response, NextFunction } from "express";
import {
  inputCapaianService,
  getCapaianService,
  getCapaianBySiswaIdService,
} from "../service/capaian.service";
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

  public async getCapaian(req: Request, res: Response, next: NextFunction) {
    try {
      const { mapelId } = req.query;
      const guruId = req.user?.guruId || "";

      if (!mapelId) {
        throw new Error("Mapel ID is required");
      }

      const result = await getCapaianService(mapelId as string, guruId);

      res.status(200).send({
        success: true,
        message: "Data capaian berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCapaianBySiswaId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { siswaId } = req.params;

      const result = await getCapaianBySiswaIdService(siswaId as string);

      res.status(200).send({
        success: true,
        message: "Data capaian siswa berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CapaianController;
