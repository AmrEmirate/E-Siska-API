import { Request, Response, NextFunction } from "express";
import { createSiswaService } from "../service/siswa.service";
import logger from "../utils/logger";

class SiswaController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Data diambil dari body setelah lolos validasi
      const dataSiswa = req.body;

      logger.info(`Mencoba membuat siswa baru dengan NIS: ${dataSiswa.nis}`);

      const result = await createSiswaService(dataSiswa);

      res.status(201).send({
        success: true,
        message: "Siswa dan Akun berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create siswa: ${error.message}`);
      }
      next(error); // Lempar ke error handler di app.ts
    }
  }

  // (Nanti kita tambahkan method lain: get, update, delete)
}

export default SiswaController;