import { prisma } from "../config/prisma";
import { createTahunAjaranRepo } from "../repositories/tahunAjaran.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

interface CreateTahunAjaranInput {
  tahunMulai: number;
  tahunAkhir: number;
  semester: number;
}

export const createTahunAjaranService = async (data: CreateTahunAjaranInput) => {
  logger.info(`Creating tahun ajaran: ${data.tahunMulai}/${data.tahunAkhir}`);

  const newTahunAjaran = await createTahunAjaranRepo(data);

  return newTahunAjaran;
};

/**
 * Get all tahun ajaran
 */
export const getAllTahunAjaranService = async () => {
  logger.info('Fetching all tahun ajaran');

  const tahunAjaran = await prisma.tahunAjaran.findMany({
    orderBy: [
      { tahunMulai: 'desc' },
      { semester: 'desc' },
    ],
  });

  return tahunAjaran;
};

/**
 * Get tahun ajaran by ID
 */
export const getTahunAjaranByIdService = async (id: string) => {
  logger.info(`Fetching tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  return tahunAjaran;
};

/**
 * Update tahun ajaran
 */
export const updateTahunAjaranService = async (id: string, data: Partial<CreateTahunAjaranInput>) => {
  logger.info(`Updating tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  const updated = await prisma.tahunAjaran.update({
    where: { id },
    data: {
      ...(data.tahunMulai && { tahunMulai: data.tahunMulai }),
      ...(data.tahunAkhir && { tahunAkhir: data.tahunAkhir }),
      ...(data.semester && { semester: data.semester }),
    },
  });

  return updated;
};

/**
 * Activate tahun ajaran (set as active, deactivate others)
 */
export const activateTahunAjaranService = async (id: string) => {
  logger.info(`Activating tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  // Deactivate all first
  await prisma.tahunAjaran.updateMany({
    data: { isActive: false },
  });

  // Activate the selected one
  const activated = await prisma.tahunAjaran.update({
    where: { id },
    data: { isActive: true },
  });

  return activated;
};

/**
 * Delete tahun ajaran
 */
export const deleteTahunAjaranService = async (id: string) => {
  logger.info(`Deleting tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  // Check if active
  if (tahunAjaran.isActive) {
    throw new AppError("Tidak dapat menghapus tahun ajaran yang sedang aktif", 400);
  }

  await prisma.tahunAjaran.delete({
    where: { id },
  });

  return { message: "Tahun ajaran berhasil dihapus" };
};