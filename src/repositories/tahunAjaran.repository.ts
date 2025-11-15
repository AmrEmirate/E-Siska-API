import { prisma } from "../config/prisma";

interface CreateTahunAjaranInput {
  nama: string;
  adminId: string;
  // isAktif default-nya false sesuai skema
}

/**
 * Membuat data Tahun Ajaran baru
 */
export const createTahunAjaranRepo = async (data: CreateTahunAjaranInput) => {
  try {
    const newTahunAjaran = await prisma.tahunAjaran.create({
      data: {
        nama: data.nama,
        adminId: data.adminId,
      },
    });
    return newTahunAjaran;
  } catch (error) {
    // Tangani error, misal nama duplikat
    throw error;
  }
};