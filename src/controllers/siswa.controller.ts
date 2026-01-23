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
        `Fetching all siswa - Page: ${page}, Limit: ${limit}, Search: ${search}`,
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
      const result = await getSiswaByIdService(id as string);
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
      const result = await updateSiswaService(id as string, updateData);
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
      const result = await deleteSiswaService(id as string);
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
      const errors: string[] = [];

      for (const row of data as any[]) {
        try {
          const nisn = row["NISN"]?.toString() || row["nisn"]?.toString();
          const nama = row["Nama"] || row["nama"] || row["NAMA"];

          if (!nisn || !nama) {
            errorCount++;
            errors.push(`Row skipped: NISN atau Nama kosong`);
            continue;
          }

          const siswaData = {
            nisn: nisn,
            nama: nama,
            jenisKelamin:
              row["Jenis Kelamin"] || row["JK"] || row["jenis_kelamin"] || "L",
            agama: row["Agama"] || row["agama"],
            tempatLahir: row["Tempat Lahir"] || row["tempat_lahir"],
            tanggalLahir: row["Tanggal Lahir"] || row["tanggal_lahir"],
            alamat: row["Alamat"] || row["alamat"],
            nik: row["NIK"]?.toString() || row["nik"]?.toString(),
            namaAyah: row["Nama Ayah"] || row["nama_ayah"],
            namaIbu: row["Nama Ibu"] || row["nama_ibu"],
            status: row["Status"] || "Aktif",
          };

          await createSiswaService(siswaData);
          successCount++;
        } catch (err: any) {
          errorCount++;
          const errMsg = err.message || "Unknown error";
          errors.push(`NISN ${row["NISN"] || "?"}: ${errMsg}`);
          logger.error(`Error importing row: ${JSON.stringify(row)} - ${err}`);
        }
      }
      res.status(200).send({
        success: true,
        message: `Import selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`,
        data: { successCount, errorCount, errors: errors.slice(0, 10) },
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
