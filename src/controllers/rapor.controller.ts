import { Request, Response, NextFunction } from "express";
import {
  generateRaporService,
  inputDataRaporService,
  getMyRaporService,
} from "../service/rapor.service";
import {
  finalizeRaporService,
  definalizeRaporService,
  overrideNilaiRaporService,
} from "../service/rapor-actions.service";
import { generateRaporPDFService } from "../service/rapor-pdf.service";
import logger from "../utils/logger";
class RaporController {
  public async updateDataRapor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId, catatan, kokurikuler } = req.body;
      const result = await inputDataRaporService({
        guruId,
        siswaId,
        tahunAjaranId,
        catatan,
        kokurikuler,
      });
      res.status(200).send({
        success: true,
        message: "Data rapor berhasil diperbarui",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update rapor: ${error.message}`);
      }
      next(error);
    }
  }
  public async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId } = req.body;
      const result = await generateRaporService({
        siswaId,
        guruId,
        tahunAjaranId,
      });
      res.status(200).send({
        success: true,
        message: "Data rapor berhasil di-generate",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error generate rapor: ${error.message}`);
      }
      next(error);
    }
  }
  public async finalize(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId } = req.body;
      const result = await finalizeRaporService({
        guruId,
        siswaId,
        tahunAjaranId,
      });
      res.status(200).send({
        success: true,
        message: "Rapor berhasil difinalisasi",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error finalize rapor: ${error.message}`);
      }
      next(error);
    }
  }
  public async definalize(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId } = req.body;
      const result = await definalizeRaporService({
        guruId,
        siswaId,
        tahunAjaranId,
      });
      res.status(200).send({
        success: true,
        message: "Rapor berhasil didefinalisasi",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error definalize rapor: ${error.message}`);
      }
      next(error);
    }
  }
  public async override(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { mapelId, tahunAjaranId, nilaiAkhir } = req.body;
      const { adminId } = req.user as any;
      const result = await overrideNilaiRaporService({
        adminId,
        siswaId,
        mapelId,
        tahunAjaranId,
        nilaiAkhir,
      });
      res.status(200).send({
        success: true,
        message: "Nilai rapor berhasil di-override",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error override nilai rapor: ${error.message}`);
      }
      next(error);
    }
  }
  public async getMyRapor(req: Request, res: Response, next: NextFunction) {
    try {
      const siswaId = req.user?.siswaId;
      if (!siswaId) {
        throw new Error("Siswa ID not found in request");
      }
      const result = await getMyRaporService(siswaId);
      res.status(200).send({
        success: true,
        message: "Rapor berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my rapor: ${error.message}`);
      }
      next(error);
    }
  }
  public async getRaporBySiswaId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { siswaId } = req.params;
      const result = await getMyRaporService(siswaId);
      res.status(200).send({
        success: true,
        message: "Rapor berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get rapor by id: ${error.message}`);
      }
      next(error);
    }
  }
  public async downloadPDF(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { tahunAjaranId } = req.query as { tahunAjaranId: string };
      const guruId = req.user?.guruId;
      if (!guruId && !req.user?.siswaId) {
        throw new Error("User tidak terautentikasi dengan benar");
      }
      if (req.user?.siswaId && req.user.siswaId !== siswaId) {
        throw new Error("Anda hanya bisa download rapor sendiri");
      }
      if (!tahunAjaranId) {
        throw new Error("Tahun ajaran ID diperlukan");
      }
      logger.info(`Generating PDF for siswa: ${siswaId}, TA: ${tahunAjaranId}`);
      const pdfDoc = await generateRaporPDFService({
        guruId: guruId || "system",
        siswaId,
        tahunAjaranId,
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=rapor-${siswaId}.pdf`
      );
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error download PDF: ${error.message}`);
      }
      next(error);
    }
  }
}
export default RaporController;
