import { prisma } from "../config/prisma";

interface CreatePenempatanInput {
  siswaId: string;
  kelasId: string;
  tahunAjaranId: string;
}

/**
 * Membuat data Penempatan Siswa baru
 */
export const createPenempatanRepo = async (data: CreatePenempatanInput) => {
  try {
    const newPenempatan = await prisma.penempatanSiswa.create({
      data: {
        siswaId: data.siswaId,
        kelasId: data.kelasId,
        tahunAjaranId: data.tahunAjaranId,
      },
    });
    return newPenempatan;
  } catch (error) {
    // Tangani error (misal unique constraint terlanggar)
    throw error;
  }
};

/**
 * Mencari penempatan berdasarkan siswaId dan tahunAjaranId
 */
export const findPenempatanBySiswaAndTahun = async (
  siswaId: string,
  tahunAjaranId: string,
) => {
  return prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: siswaId,
        tahunAjaranId: tahunAjaranId,
      },
    },
  });
};