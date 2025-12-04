import PDFDocument from "pdfkit";
import { generateRaporService } from "./rapor.service";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import {
  drawHeader,
  drawStudentInfo,
  drawAcademicGrades,
  drawExtracurriculars,
  drawAttendance,
  drawNotes,
  drawKokurikuler,
  drawFooter,
} from "../utils/pdf-helpers";
interface GeneratePDFInput {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
}
export const generateRaporPDFService = async (
  input: GeneratePDFInput
): Promise<PDFKit.PDFDocument> => {
  logger.info(
    `Generating PDF for siswa ${input.siswaId}, TA: ${input.tahunAjaranId}`
  );
  const raporData = await generateRaporService(input);
  if (!raporData) {
    throw new AppError("Data rapor tidak ditemukan", 404);
  }
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });
  drawHeader(doc, raporData.infoSiswa.tahunAjaran);
  let yPos = 140;
  yPos = drawStudentInfo(doc, raporData.infoSiswa, yPos);
  yPos = drawAcademicGrades(doc, raporData.nilaiAkademik, yPos);
  if (raporData.ekstrakurikuler && raporData.ekstrakurikuler.length > 0) {
    yPos = drawExtracurriculars(doc, raporData.ekstrakurikuler, yPos);
  }
  yPos = drawAttendance(doc, raporData.ketidakhadiran, yPos);
  yPos = drawNotes(doc, raporData.catatanWaliKelas, yPos);
  yPos = drawKokurikuler(doc, raporData.dataKokurikuler, yPos);
  drawFooter(doc, raporData.status, yPos);
  logger.info(`PDF generated successfully for siswa ${input.siswaId}`);
  return doc;
};
