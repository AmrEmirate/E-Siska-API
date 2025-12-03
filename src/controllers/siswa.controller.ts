import { Request, Response, NextFunction } from "express";
import {
  createSiswaService,
  getAllSiswaService,
  getSiswaByIdService,
  updateSiswaService,
  deleteSiswaService,
} from "../service/siswa.service";
import logger from "../utils/logger";

class SiswaController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dataSiswa = req.body;

      logger.info(`Mencoba membuat siswa baru dengan NISN: ${dataSiswa.nisn}`);

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
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = (req.query.search as string) || "";

      logger.info(
        `Fetching all siswa - Page: ${page}, Limit: ${limit}, Search: ${search}`
      );

      const result = await getAllSiswaService(page, limit, search);

      res.status(200).send({
        success: true,
        message: "Data siswa berhasil diambil",
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get all siswa: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info(`Fetching siswa by ID: ${id}`);

      const result = await getSiswaByIdService(id);

      res.status(200).send({
        success: true,
        message: "Data siswa berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get siswa by ID: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      logger.info(`Updating siswa: ${id}`);

      const result = await updateSiswaService(id, updateData);

      res.status(200).send({
        success: true,
        message: "Data siswa berhasil diupdate",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update siswa: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info(`Deleting siswa: ${id}`);

      const result = await deleteSiswaService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete siswa: ${error.message}`);
      }
      next(error);
    }
  }

  public async importSiswa(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).send({
          success: false,
          message: "File excel tidak ditemukan",
        });
        return;
      }

      const xlsx = require("xlsx");
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      logger.info(`Importing ${data.length} siswa records`);

      let successCount = 0;
      let errorCount = 0;

      for (const row of data as any[]) {
        try {
          // Map excel columns to expected object structure
          // Assumes columns: NIS, NISN, Nama, Email, No HP, Alamat, Jenis Kelamin
          const siswaData = {
            nisn: row["NISN"]?.toString(),
            nama: row["Nama"],
            email: row["Email"],
            noHp: row["No HP"]?.toString(),
            alamat: row["Alamat"],
            jenisKelamin: row["Jenis Kelamin"],
            username: row["NISN"]?.toString(), // Default username to NISN
            password: row["NISN"]?.toString(), // Default password to NISN
          };

          if (siswaData.nisn && siswaData.nama && siswaData.email) {
            await createSiswaService(siswaData);
            successCount++;
          } else {
            errorCount++;
            logger.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
          }
        } catch (err) {
          errorCount++;
          logger.error(`Error importing row: ${JSON.stringify(row)} - ${err}`);
        }
      }

      res.status(200).send({
        success: true,
        message: `Import selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`,
        data: { successCount, errorCount },
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error import siswa: ${error.message}`);
      }
      next(error);
    }
  }
}

export default SiswaController;
