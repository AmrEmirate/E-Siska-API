import { UserRole } from "../generated/prisma";
import { createSiswaRepo } from "../repositories/siswa.repository";
import AppError from "../utils/AppError";
import { hashPassword } from "../utils/hashPassword";
import logger from "../utils/logger";

interface CreateSiswaServiceInput {
  nis: string;
  nama: string;
  tanggalLahir?: string; // Terima sebagai string, ubah ke Date
  alamat?: string;
}

export const createSiswaService = async (data: CreateSiswaServiceInput) => {
  const { nis, nama, tanggalLahir, alamat } = data;

  // Logika Bisnis: Sesuai dokumen 
  // 1. Username adalah NIS
  const username = nis;
  // 2. Password default adalah 6 digit terakhir NIS
  if (nis.length < 6) {
    throw new AppError("NIS harus memiliki minimal 6 digit", 400);
  }
  const defaultPassword = nis.slice(-6);

  // 3. Hash password
  const passwordHash = await hashPassword(defaultPassword);
  logger.info(`Password default dibuat untuk NIS: ${nis}`);

  // 4. Siapkan data untuk repository
  const repoInput = {
    nis,
    nama,
    tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
    alamat,
    username,
    passwordHash,
    role: UserRole.SISWA, // Role dari enum
  };

  // 5. Panggil Repository
  const newSiswaData = await createSiswaRepo(repoInput);

  return newSiswaData;
};