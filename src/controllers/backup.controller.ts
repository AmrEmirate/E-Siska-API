import { Request, Response, NextFunction } from "express";
import {
  createBackupService,
  restoreBackupService,
} from "../service/backup.service";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

class BackupController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Admin requesting database backup");

      const result = await createBackupService();
      const fileName = `backup-e-siska-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`;

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      res.status(200).send(JSON.stringify(result, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating backup: ${error.message}`);
      }
      next(error);
    }
  }

  public async restore(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("File backup tidak ditemukan", 400);
      }

      logger.warn("Admin requesting database restore");
      logger.info(`File received: ${req.file.originalname}, size: ${req.file.size} bytes`);

      let backupData;
      try {
        const fileContent = req.file.buffer.toString("utf-8");
        logger.info(`File content length: ${fileContent.length} characters`);
        backupData = JSON.parse(fileContent);
        logger.info(`Parsed backup data, timestamp: ${backupData.timestamp}, version: ${backupData.version}`);
      } catch (parseError: any) {
        logger.error(`JSON parse error: ${parseError.message}`);
        throw new AppError("Format file backup tidak valid (harus JSON)", 400);
      }

      const result = await restoreBackupService(backupData);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: any) {
      logger.error(`Error restoring backup: ${error.message}`);
      logger.error(`Error stack: ${error.stack}`);
      
      // Return detailed error to frontend
      res.status(error.statusCode || 500).send({
        success: false,
        message: error.message || "Gagal restore database",
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

export default BackupController;
