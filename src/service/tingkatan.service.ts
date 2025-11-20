import { prisma } from "../config/prisma";
import { createTingkatanRepo } from "../repositories/tingkatan.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

export const createTingkatanService = async (namaTingkat: string) => {
  logger.info(`Mencoba membuat tingkatan kelas: ${namaTingkat}`);
  
  const newTingkatan = await createTingkatanRepo(namaTingkat);

  return newTingkatan;
};

/**
 * Get all tingkatan
 */
export const getAllTingkatanService = async () => {
  logger.info('Fetching all tingkatan');

  const tingkatan = await prisma.tingkatanKelas.findMany({
    orderBy: {
      namaTingkat: 'asc',
    },
  });

  return tingkatan;
};

/**
 * Update tingkatan
 */
export const updateTingkatanService = async (id: string, namaTingkat: string) => {
  logger.info(`Updating tingkatan: ${id}`);

  const tingkatan = await prisma.tingkatanKelas.findUnique({
    where: { id },
  });

  if (!tingkatan) {
    throw new AppError("Tingkatan tidak ditemukan", 404);
  }

  const updated = await prisma.tingkatanKelas.update({
    where: { id },
    data: { namaTingkat },
  });

  return updated;
};

/**
 * Delete tingkatan
 */
export const deleteTingkatanService = async (id: string) => {
  logger.info(`Deleting tingkatan: ${id}`);

  const tingkatan = await prisma.tingkatanKelas.findUnique({
    where: { id },
    include: {
      Kelas: true,
    },
  });

  if (!tingkatan) {
    throw new AppError("Tingkatan tidak ditemukan", 404);
  }

  // Check if tingkatan is used by any kelas
  if (tingkatan.Kelas && tingkatan.Kelas.length > 0) {
    throw new AppError("Tidak dapat menghapus tingkatan yang masih digunakan oleh kelas", 400);
  }

  await prisma.tingkatanKelas.delete({
    where: { id },
  });

  return { message: "Tingkatan berhasil dihapus" };
};