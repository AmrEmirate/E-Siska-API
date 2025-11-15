import {
  createPenempatanRepo,
  findPenempatanBySiswaAndTahun,
} from "../repositories/penempatan.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreatePenempatanServiceInput {
  siswaId: string;
  kelasId: string;
  tahunAjaranId: string;
}

export const createPenempatanService = async (
  data: CreatePenempatanServiceInput,
) => {
  logger.info(`Mencoba menempatkan siswa ${data.siswaId} ke kelas ${data.kelasId}`);

  // --- Logika Bisnis 1: Cek dependensi ---
  // (Kita bisa tambahkan pengecekan apakah Siswa, Kelas, dan TA ada)
  const [siswa, kelas, tahunAjaran] = await Promise.all([
    prisma.siswa.findUnique({ where: { id: data.siswaId } }),
    prisma.kelas.findUnique({ where: { id: data.kelasId } }),
    prisma.tahunAjaran.findUnique({ where: { id: data.tahunAjaranId } }),
  ]);

  if (!siswa) throw new AppError("Siswa tidak ditemukan", 404);
  if (!kelas) throw new AppError("Kelas tidak ditemukan", 404);
  if (!tahunAjaran) throw new AppError("Tahun Ajaran tidak ditemukan", 404);

  // --- Logika Bisnis 2: Cek Aturan Unik ---
  const existingPenempatan = await findPenempatanBySiswaAndTahun(
    data.siswaId,
    data.tahunAjaranId,
  );

  if (existingPenempatan) {
    throw new AppError(
      `Siswa ini sudah ditempatkan di kelas lain pada tahun ajaran ${tahunAjaran.nama}`,
      409, // 409 Conflict
    );
  }

  // --- Panggil Repository ---
  const newPenempatan = await createPenempatanRepo(data);

  return newPenempatan;
};