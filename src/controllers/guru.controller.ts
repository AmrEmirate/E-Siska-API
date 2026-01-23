import { Request, Response, NextFunction } from "express";
import {
  createGuruService,
  getAllGuruService,
  getGuruByIdService,
  updateGuruService,
  deleteGuruService,
} from "../service/guru.service";
import logger from "../utils/logger";
class GuruController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dataGuru = req.body;
      logger.info(`Mencoba membuat guru baru dengan NIP: ${dataGuru.nip}`);
      const result = await createGuruService(dataGuru);
      res.status(201).send({
        success: true,
        message: "Guru dan Akun berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create guru: ${error.message}`);
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
        `Fetching all guru - Page: ${page}, Limit: ${limit}, Search: ${search}`,
      );
      const result = await getAllGuruService(page, limit, search);
      res.status(200).send({
        success: true,
        message: "Data guru berhasil diambil",
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get all guru: ${error.message}`);
      }
      next(error);
    }
  }
  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`Fetching guru by ID: ${id}`);
      const result = await getGuruByIdService(id as string);
      res.status(200).send({
        success: true,
        message: "Data guru berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get guru by ID: ${error.message}`);
      }
      next(error);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      logger.info(`Updating guru: ${id}`);
      const result = await updateGuruService(id as string, updateData);
      res.status(200).send({
        success: true,
        message: "Data guru berhasil diupdate",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update guru: ${error.message}`);
      }
      next(error);
    }
  }
  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`Deleting guru: ${id}`);
      const result = await deleteGuruService(id as string);
      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete guru: ${error.message}`);
      }
      next(error);
    }
  }
  public async importGuru(req: Request, res: Response, next: NextFunction) {
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
      logger.info(`Importing ${data.length} guru records`);
      let successCount = 0;
      let errorCount = 0;
      for (const row of data as any[]) {
        try {
          const guruData = {
            nip: row["NIP"]?.toString(),
            nama: row["Nama"],
            email: row["Email"],
            noHp: row["No HP"]?.toString(),
            mataPelajaran: row["Mata Pelajaran"],
          };
          if (guruData.nip && guruData.nama && guruData.email) {
            await createGuruService(guruData);
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
        logger.error(`Error import guru: ${error.message}`);
      }
      next(error);
    }
  }
}
export default GuruController;
