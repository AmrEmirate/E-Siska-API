import { Request, Response, NextFunction } from "express";
import {
  inputNilaiService,
  getNilaiKelasService,
  getMyGradesService,
  getAllNilaiService,
  updateNilaiService,
  deleteNilaiService,
  getNilaiByKelasOnlyService,
} from "../service/nilai.service";
import logger from "../utils/logger";

class NilaiController {
  public async inputNilai(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, mapelId, komponenId, data } = req.body;

      const result = await inputNilaiService({
        guruId,
        mapelId,
        komponenId,
        data,
      });

      res.status(200).send({
        success: true,
        message: "Nilai berhasil disimpan",
        totalData: result.length,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error input nilai: ${error.message}`);
      }
      next(error);
    }
  }

  public async getNilaiKelas(req: Request, res: Response, next: NextFunction) {
    try {
      const { kelasId, mapelId } = req.params;
      const guruId = req.user?.guruId || "";

      const result = await getNilaiKelasService(guruId, kelasId, mapelId);

      res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getMyGrades(req: Request, res: Response, next: NextFunction) {
    try {
      const siswaId = req.user?.siswaId;

      if (!siswaId) {
        throw new Error("Siswa ID not found in request");
      }

      const result = await getMyGradesService(siswaId);

      res.status(200).send({
        success: true,
        message: "Nilai berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my grades: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId, mapelId, tahunAjaranId } = req.query;

      const result = await getAllNilaiService({
        siswaId: siswaId as string,
        mapelId: mapelId as string,
        tahunAjaranId: tahunAjaranId as string,
      });

      res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nilai } = req.body;
      const guruId = req.user?.guruId || "";

      const result = await updateNilaiService(id, nilai, guruId);

      res.status(200).send({
        success: true,
        message: "Nilai berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await deleteNilaiService(id);

      res.status(200).send({
        success: true,
        message: "Nilai berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  // Endpoint untuk wali kelas - mendapatkan semua nilai siswa di kelasnya
  public async getNilaiByKelasOnly(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { kelasId } = req.params;

      const result = await getNilaiByKelasOnlyService(kelasId);

      res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get nilai by kelas: ${error.message}`);
      }
      next(error);
    }
  }
}

export default NilaiController;
