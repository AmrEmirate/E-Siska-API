import { createSesiRepo } from "../repositories/absensi.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreateSesiServiceInput {
  guruId: string;
  kelasId: string;
  tanggal: string; // String dari body, nanti diubah ke Date
  pertemuanKe: number;
}

export const createSesiService = async (data: CreateSesiServiceInput) => {
  logger.info(`Mencoba membuat sesi absensi untuk kelas ${data.kelasId}`);

  // --- Logika Bisnis: Validasi Guru Mengajar di Kelas Itu ---
  // Kita cek apakah ada minimal SATU penugasan guru tersebut di kelas itu.
  // (Karena AbsensiSesi di schema tidak mengikat Mapel, hanya Guru & Kelas)
  const penugasan = await prisma.penugasanGuru.findFirst({
    where: {
      guruId: data.guruId,
      kelasId: data.kelasId,
    },
  });

  if (!penugasan) {
    throw new AppError(
      "Guru tidak terdaftar mengajar di kelas ini. Tidak bisa membuat sesi.",
      403,
    );
  }

  // Konversi tanggal
  const tanggalObj = new Date(data.tanggal);

  // Cek apakah sesi duplikat (untuk UX yang lebih baik, meski DB sudah handle unique)
  const existingSesi = await prisma.absensiSesi.findUnique({
    where: {
      kelasId_tanggal_pertemuanKe: {
        kelasId: data.kelasId,
        tanggal: tanggalObj,
        pertemuanKe: data.pertemuanKe,
      },
    },
  });

  if (existingSesi) {
    throw new AppError(
      `Sesi pertemuan ke-${data.pertemuanKe} pada tanggal tersebut sudah dibuat.`,
      409,
    );
  }

  // Panggil Repository
  const newSesi = await createSesiRepo({
    guruId: data.guruId,
    kelasId: data.kelasId,
    tanggal: tanggalObj,
    pertemuanKe: data.pertemuanKe,
  });

  return newSesi;
};