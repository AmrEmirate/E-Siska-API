import { createKelasRepo } from "../repositories/kelas.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreateKelasServiceInput {
  namaKelas: string;
  tingkatanId: string;
  waliKelasId?: string;
}

export const createKelasService = async (data: CreateKelasServiceInput) => {
  logger.info(`Mencoba membuat kelas: ${data.namaKelas}`);

  // Validasi opsional: Pastikan Tingkatan dan Guru (jika ada) benar-benar ada
  const tingkatan = await prisma.tingkatanKelas.findUnique({
    where: { id: data.tingkatanId },
  });
  if (!tingkatan) {
    throw new AppError("Tingkatan Kelas tidak ditemukan", 404);
  }

  if (data.waliKelasId) {
    const guru = await prisma.guru.findUnique({
      where: { id: data.waliKelasId },
    });
    if (!guru) {
      throw new AppError("Guru (calon Wali Kelas) tidak ditemukan", 404);
    }
  }

  // Panggil Repository
  const newKelas = await createKelasRepo(data);

  return newKelas;
};