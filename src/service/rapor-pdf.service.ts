import PDFDocument from "pdfkit";
import { generateRaporService } from "./rapor.service";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

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

  // Reuse existing service untuk ambil data rapor
  const raporData = await generateRaporService(input);

  if (!raporData) {
    throw new AppError("Data rapor tidak ditemukan", 404);
  }

  // Create PDF document
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });

  // Helper functions
  const drawLine = (y: number) => {
    doc.moveTo(50, y).lineTo(545, y).stroke();
  };

  const addText = (
    text: string,
    x: number,
    y: number,
    options?: PDFKit.Mixins.TextOptions
  ) => {
    doc.text(text, x, y, options);
  };

  // ===== HEADER =====
  doc.fontSize(18).font("Helvetica-Bold");
  addText("RAPOR HASIL BELAJAR SISWA", 50, 60, { align: "center", width: 495 });

  doc.fontSize(10).font("Helvetica");
  addText("SDN Ciater 02 Serpong", 50, 85, { align: "center", width: 495 });
  addText("Tahun Pelajaran " + raporData.infoSiswa.tahunAjaran, 50, 100, {
    align: "center",
    width: 495,
  });

  drawLine(120);

  // ===== INFO SISWA =====
  let yPos = 140;
  doc.fontSize(11).font("Helvetica-Bold");
  addText("IDENTITAS SISWA", 50, yPos);

  yPos += 25;
  doc.fontSize(10).font("Helvetica");

  const infoRows = [
    ["Nama", ": " + raporData.infoSiswa.nama],
    ["NISN", ": " + raporData.infoSiswa.nisn],
    ["Kelas", ": " + raporData.infoSiswa.kelas],
  ];

  infoRows.forEach(([label, value]) => {
    addText(label, 70, yPos, { width: 100 });
    addText(value, 170, yPos);
    yPos += 20;
  });

  yPos += 10;
  drawLine(yPos);

  // ===== NILAI AKADEMIK =====
  yPos += 20;
  doc.fontSize(11).font("Helvetica-Bold");
  addText("NILAI AKADEMIK", 50, yPos);

  yPos += 25;

  // Table Header
  doc.fontSize(9).font("Helvetica-Bold");
  const colWidths = {
    no: 30,
    mapel: 150,
    kkm: 40,
    nilai: 50,
    predikat: 50,
  };

  addText("No", 50, yPos, { width: colWidths.no });
  addText("Mata Pelajaran", 85, yPos, { width: colWidths.mapel });
  addText("KKM", 240, yPos, { width: colWidths.kkm, align: "center" });
  addText("Nilai", 285, yPos, { width: colWidths.nilai, align: "center" });
  addText("Predikat", 340, yPos, {
    width: colWidths.predikat,
    align: "center",
  });

  yPos += 15;
  drawLine(yPos);
  yPos += 10;

  // Table Body
  doc.fontSize(9).font("Helvetica");
  raporData.nilaiAkademik.forEach((nilai: any, index: number) => {
    const no = (index + 1).toString();
    addText(no, 50, yPos, { width: colWidths.no, align: "center" });
    addText(nilai.mapel, 85, yPos, { width: colWidths.mapel });
    addText(nilai.kkm.toString(), 240, yPos, {
      width: colWidths.kkm,
      align: "center",
    });
    addText(nilai.nilaiAkhir.toFixed(0), 285, yPos, {
      width: colWidths.nilai,
      align: "center",
    });
    addText(nilai.predikat, 340, yPos, {
      width: colWidths.predikat,
      align: "center",
    });

    yPos += 20;

    // Check if need new page
    if (yPos > 720) {
      doc.addPage();
      yPos = 50;
    }
  });

  yPos += 5;
  drawLine(yPos);

  // ===== EKSTRAKURIKULER =====
  if (raporData.ekstrakurikuler && raporData.ekstrakurikuler.length > 0) {
    yPos += 20;

    if (yPos > 650) {
      doc.addPage();
      yPos = 50;
    }

    doc.fontSize(11).font("Helvetica-Bold");
    addText("EKSTRAKURIKULER", 50, yPos);

    yPos += 25;

    doc.fontSize(9).font("Helvetica-Bold");
    addText("Kegiatan", 50, yPos, { width: 200 });
    addText("Keterangan", 255, yPos, { width: 290 });

    yPos += 15;
    drawLine(yPos);
    yPos += 10;

    doc.fontSize(9).font("Helvetica");
    raporData.ekstrakurikuler.forEach((ekskul: any) => {
      addText(ekskul.nama, 50, yPos, { width: 200 });
      addText(ekskul.deskripsi || "-", 255, yPos, { width: 290 });
      yPos += 20;

      if (yPos > 720) {
        doc.addPage();
        yPos = 50;
      }
    });

    yPos += 5;
    drawLine(yPos);
  }

  // ===== KETIDAKHADIRAN =====
  yPos += 20;

  if (yPos > 650) {
    doc.addPage();
    yPos = 50;
  }

  doc.fontSize(11).font("Helvetica-Bold");
  addText("KETIDAKHADIRAN", 50, yPos);

  yPos += 25;
  doc.fontSize(10).font("Helvetica");

  const absensiRows = [
    ["Sakit", ": " + (raporData.ketidakhadiran.SAKIT || 0) + " hari"],
    ["Izin", ": " + (raporData.ketidakhadiran.IZIN || 0) + " hari"],
    [
      "Tanpa Keterangan",
      ": " + (raporData.ketidakhadiran.ALPHA || 0) + " hari",
    ],
  ];

  absensiRows.forEach(([label, value]) => {
    addText(label, 70, yPos, { width: 150 });
    addText(value, 220, yPos);
    yPos += 20;
  });

  yPos += 10;
  drawLine(yPos);

  // ===== CATATAN WALI KELAS =====
  yPos += 20;

  if (yPos > 600) {
    doc.addPage();
    yPos = 50;
  }

  doc.fontSize(11).font("Helvetica-Bold");
  addText("CATATAN WALI KELAS", 50, yPos);

  yPos += 20;
  doc.fontSize(10).font("Helvetica");
  doc.text(raporData.catatanWaliKelas || "-", 50, yPos, {
    width: 495,
    align: "justify",
  });

  yPos += 60;

  // ===== KOKURIKULER =====
  if (yPos > 600) {
    doc.addPage();
    yPos = 50;
  }

  doc.fontSize(11).font("Helvetica-Bold");
  addText("DATA KOKURIKULER", 50, yPos);

  yPos += 20;
  doc.fontSize(10).font("Helvetica");
  doc.text(raporData.dataKokurikuler || "-", 50, yPos, {
    width: 495,
    align: "justify",
  });

  yPos += 80;

  // ===== FOOTER / TANDA TANGAN =====
  if (yPos > 600) {
    doc.addPage();
    yPos = 50;
  }

  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.fontSize(10).font("Helvetica");
  addText("Serpong, " + tanggalCetak, 350, yPos);

  yPos += 20;
  addText("Wali Kelas,", 350, yPos);

  yPos += 60;
  addText("(_____________________)", 350, yPos);

  // ===== STATUS =====
  yPos += 30;
  doc.fontSize(9).font("Helvetica-Oblique");
  addText(
    "Status: " + (raporData.status === "FINAL" ? "Difinalisasi" : "Draft"),
    50,
    yPos,
    { width: 495, align: "center" }
  );

  logger.info(`PDF generated successfully for siswa ${input.siswaId}`);

  return doc;
};
