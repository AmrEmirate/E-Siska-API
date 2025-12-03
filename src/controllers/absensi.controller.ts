import { Request, Response, NextFunction } from "express";
import {
  createSesiService,
  getSesiByKelasService,
  getSesiDetailService,
  getAbsensiByStudentService,
} from "../service/absensi.service";
import logger from "../utils/logger";

class AbsensiController {
  public async createSesi(req: Request, res: Response, next: NextFunction) {
    try {
      const { kelasId, tanggal, pertemuanKe } = req.body;
      const guruId = req.user?.guruId;

      if (!guruId) {
        throw new Error("Guru ID not found in request");
      }

      const result = await createSesiService({
        guruId,
        kelasId,
        tanggal,
        pertemuanKe,
      });

      res.status(201).send({
        success: true,
        message: "Sesi absensi berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create sesi absensi: ${error.message}`);
      }
      next(error);
    }
  }

  public async getSesiByKelas(req: Request, res: Response, next: NextFunction) {
    try {
      const { kelasId } = req.params;

      const result = await getSesiByKelasService(kelasId);

      res.status(200).send({
        success: true,
        message: "Daftar sesi berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get sesi by kelas: ${error.message}`);
      }
      next(error);
    }
  }

  public async getSesiDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { sesiId } = req.params;

      const result = await getSesiDetailService(sesiId);

      res.status(200).send({
        success: true,
        message: "Detail sesi berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get sesi detail: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAbsensiByStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { siswaId } = req.query;
      let targetSiswaId = siswaId as string;

      // Jika user adalah SISWA, paksa filter berdasarkan siswaId dari token
      if ((req as any).user?.role === "SISWA") {
        targetSiswaId = (req as any).user?.siswaId;
      }

      if (!targetSiswaId) {
        // Jika tidak ada siswaId (dan bukan siswa), kembalikan kosong atau error sesuai kebutuhan
        // Di sini kita kembalikan array kosong agar tidak error
        res.status(200).send({
          success: true,
          message: "Data absensi berhasil diambil",
          data: [],
        });
        return;
      }

      const result = await getAbsensiByStudentService(targetSiswaId);

      res.status(200).send({
        success: true,
        message: "Data absensi berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get absensi by student: ${error.message}`);
      }
      next(error);
    }
  }
}

export default AbsensiController;
