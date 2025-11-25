import { prisma } from "../config/prisma";

interface CreateSesiInput {
  guruId: string;
  kelasId: string;
  tanggal: Date;
  pertemuanKe: number;
}

/**
 * Membuat Sesi Absensi baru
 */
export const createSesiRepo = async (data: CreateSesiInput) => {
  try {
    const newSesi = await prisma.absensiSesi.create({
      data: {
        guruId: data.guruId,
        kelasId: data.kelasId,
        tanggal: data.tanggal,
        pertemuanKe: data.pertemuanKe,
      },
    });
    return newSesi;
  } catch (error) {
    // Tangani error, misal sesi pada tanggal/pertemuan tsb sudah ada
    throw error;
  }
};

export const findSesiByKelasRepo = async (kelasId: string) => {
  return await prisma.absensiSesi.findMany({
    where: { kelasId },
    orderBy: { tanggal: 'desc' },
    include: {
      _count: {
        select: { Detail: true }
      }
    }
  });
};

export const findSesiByIdRepo = async (sesiId: string) => {
  return await prisma.absensiSesi.findUnique({
    where: { id: sesiId },
    include: {
      kelas: true,
      Detail: {
        include: {
          siswa: true
        }
      }
    }
  });
};