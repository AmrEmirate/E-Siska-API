import PDFDocument from "pdfkit";
export const drawLine = (doc: PDFKit.PDFDocument, y: number) => {
  doc.moveTo(50, y).lineTo(545, y).stroke();
};
export const addText = (
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  options?: PDFKit.Mixins.TextOptions
) => {
  doc.text(text, x, y, options);
};
export const drawHeader = (doc: PDFKit.PDFDocument, tahunAjaran: string) => {
  doc.fontSize(18).font("Helvetica-Bold");
  addText(doc, "RAPOR HASIL BELAJAR SISWA", 50, 60, {
    align: "center",
    width: 495,
  });
  doc.fontSize(10).font("Helvetica");
  addText(doc, "SDN Ciater 02 Serpong", 50, 85, {
    align: "center",
    width: 495,
  });
  addText(doc, "Tahun Pelajaran " + tahunAjaran, 50, 100, {
    align: "center",
    width: 495,
  });
  drawLine(doc, 120);
};
export const drawStudentInfo = (
  doc: PDFKit.PDFDocument,
  infoSiswa: any,
  startY: number
) => {
  let yPos = startY;
  doc.fontSize(11).font("Helvetica-Bold");
  addText(doc, "IDENTITAS SISWA", 50, yPos);
  yPos += 25;
  doc.fontSize(10).font("Helvetica");
  const infoRows = [
    ["Nama", ": " + infoSiswa.nama],
    ["NISN", ": " + infoSiswa.nisn],
    ["Kelas", ": " + infoSiswa.kelas],
  ];
  infoRows.forEach(([label, value]) => {
    addText(doc, label, 70, yPos, { width: 100 });
    addText(doc, value, 170, yPos);
    yPos += 20;
  });
  yPos += 10;
  drawLine(doc, yPos);
  return yPos;
};
export const drawAcademicGrades = (
  doc: PDFKit.PDFDocument,
  nilaiAkademik: any[],
  startY: number
) => {
  let yPos = startY + 20;
  doc.fontSize(11).font("Helvetica-Bold");
  addText(doc, "NILAI AKADEMIK", 50, yPos);
  yPos += 25;
  doc.fontSize(9).font("Helvetica-Bold");
  const colWidths = {
    no: 30,
    mapel: 150,
    kkm: 40,
    nilai: 50,
    predikat: 50,
  };
  addText(doc, "No", 50, yPos, { width: colWidths.no });
  addText(doc, "Mata Pelajaran", 85, yPos, { width: colWidths.mapel });
  addText(doc, "KKM", 240, yPos, { width: colWidths.kkm, align: "center" });
  addText(doc, "Nilai", 285, yPos, { width: colWidths.nilai, align: "center" });
  addText(doc, "Predikat", 340, yPos, {
    width: colWidths.predikat,
    align: "center",
  });
  yPos += 15;
  drawLine(doc, yPos);
  yPos += 10;
  doc.fontSize(9).font("Helvetica");
  nilaiAkademik.forEach((nilai: any, index: number) => {
    const no = (index + 1).toString();
    addText(doc, no, 50, yPos, { width: colWidths.no, align: "center" });
    addText(doc, nilai.mapel, 85, yPos, { width: colWidths.mapel });
    addText(doc, nilai.kkm.toString(), 240, yPos, {
      width: colWidths.kkm,
      align: "center",
    });
    addText(doc, nilai.nilaiAkhir.toFixed(0), 285, yPos, {
      width: colWidths.nilai,
      align: "center",
    });
    addText(doc, nilai.predikat, 340, yPos, {
      width: colWidths.predikat,
      align: "center",
    });
    yPos += 20;
    if (yPos > 720) {
      doc.addPage();
      yPos = 50;
    }
  });
  yPos += 5;
  drawLine(doc, yPos);
  return yPos;
};
export const drawExtracurriculars = (
  doc: PDFKit.PDFDocument,
  ekstrakurikuler: any[],
  startY: number
) => {
  let yPos = startY + 20;
  if (yPos > 650) {
    doc.addPage();
    yPos = 50;
  }
  doc.fontSize(11).font("Helvetica-Bold");
  addText(doc, "EKSTRAKURIKULER", 50, yPos);
  yPos += 25;
  doc.fontSize(9).font("Helvetica-Bold");
  addText(doc, "Kegiatan", 50, yPos, { width: 200 });
  addText(doc, "Keterangan", 255, yPos, { width: 290 });
  yPos += 15;
  drawLine(doc, yPos);
  yPos += 10;
  doc.fontSize(9).font("Helvetica");
  ekstrakurikuler.forEach((ekskul: any) => {
    addText(doc, ekskul.nama, 50, yPos, { width: 200 });
    addText(doc, ekskul.deskripsi || "-", 255, yPos, { width: 290 });
    yPos += 20;
    if (yPos > 720) {
      doc.addPage();
      yPos = 50;
    }
  });
  yPos += 5;
  drawLine(doc, yPos);
  return yPos;
};
export const drawAttendance = (
  doc: PDFKit.PDFDocument,
  ketidakhadiran: any,
  startY: number
) => {
  let yPos = startY + 20;
  if (yPos > 650) {
    doc.addPage();
    yPos = 50;
  }
  doc.fontSize(11).font("Helvetica-Bold");
  addText(doc, "KETIDAKHADIRAN", 50, yPos);
  yPos += 25;
  doc.fontSize(10).font("Helvetica");
  const absensiRows = [
    ["Sakit", ": " + (ketidakhadiran.SAKIT || 0) + " hari"],
    ["Izin", ": " + (ketidakhadiran.IZIN || 0) + " hari"],
    ["Tanpa Keterangan", ": " + (ketidakhadiran.ALPHA || 0) + " hari"],
  ];
  absensiRows.forEach(([label, value]) => {
    addText(doc, label, 70, yPos, { width: 150 });
    addText(doc, value, 220, yPos);
    yPos += 20;
  });
  yPos += 10;
  drawLine(doc, yPos);
  return yPos;
};
export const drawNotes = (
  doc: PDFKit.PDFDocument,
  catatan: string,
  startY: number
) => {
  let yPos = startY + 20;
  if (yPos > 600) {
    doc.addPage();
    yPos = 50;
  }
  doc.fontSize(11).font("Helvetica-Bold");
  addText(doc, "CATATAN WALI KELAS", 50, yPos);
  yPos += 20;
  doc.fontSize(10).font("Helvetica");
  doc.text(catatan || "-", 50, yPos, {
    width: 495,
    align: "justify",
  });
  return doc.y; 
};
export const drawKokurikuler = (
  doc: PDFKit.PDFDocument,
  data: string,
  startY: number
) => {
  let yPos = startY + 20;
  if (yPos > 600) {
    doc.addPage();
    yPos = 50;
  }
  doc.fontSize(11).font("Helvetica-Bold");
  addText(doc, "DATA KOKURIKULER", 50, yPos);
  yPos += 20;
  doc.fontSize(10).font("Helvetica");
  doc.text(data || "-", 50, yPos, {
    width: 495,
    align: "justify",
  });
  return doc.y;
};
export const drawFooter = (
  doc: PDFKit.PDFDocument,
  status: string,
  startY: number
) => {
  let yPos = startY + 40;
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
  addText(doc, "Serpong, " + tanggalCetak, 350, yPos);
  yPos += 20;
  addText(doc, "Wali Kelas,", 350, yPos);
  yPos += 60;
  addText(doc, "(_____________________)", 350, yPos);
  yPos += 30;
  doc.fontSize(9).font("Helvetica-Oblique");
  addText(
    doc,
    "Status: " + (status === "FINAL" ? "Difinalisasi" : "Draft"),
    50,
    yPos,
    { width: 495, align: "center" }
  );
};
