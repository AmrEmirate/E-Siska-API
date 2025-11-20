import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

/**
 * Get student's own attendance summary
 */
export const getMyAbsensiService = async (siswaId: string, tahunAjaranId?: string) => {
  logger.info(`Fetching attendance for siswa: ${siswaId}`);

  // Get penempatan to find kelas
  const penempatan = await prisma.penempatanSiswa.findFirst({
    where: {
      siswaId: siswaId,
      ...(tahunAjaranId && { tahunAjaranId }),
    },
    include: {
      kelas: true,
      tahunAjaran: true,
    },
  });

  if (!penempatan) {
    throw new AppError("Penempatan siswa tidak ditemukan", 404);
  }

  // Get all attendance details for this student
  const absensiDetails = await prisma.absensiDetail.findMany({
    where: {
      siswaId: siswaId,
      sesi: {
        kelasId: penempatan.kelasId,
      },
    },
    include: {
      sesi: true,
    },
    orderBy: {
      sesi: {
        tanggal: 'desc',
      },
    },
  });

  // Calculate summary
  const summary = {
    hadir: absensiDetails.filter(a => a.status === 'HADIR').length,
    sakit: absensiDetails.filter(a => a.status === 'SAKIT').length,
    izin: absensiDetails.filter(a => a.status === 'IZIN').length,
    alpha: absensiDetails.filter(a => a.status === 'ALPHA').length,
    total: absensiDetails.length,
  };

  return {
    kelas: penempatan.kelas,
    tahunAjaran: penempatan.tahunAjaran,
    summary,
    details: absensiDetails,
  };
};

/**
 * Get student's own grades
 */
export const getMyNilaiService = async (siswaId: string, tahunAjaranId?: string) => {
  logger.info(`Fetching grades for siswa: ${siswaId}`);

  // Get penempatan to find kelas
  const penempatan = await prisma.penempatanSiswa.findFirst({
    where: {
      siswaId: siswaId,
      ...(tahunAjaranId && { tahunAjaranId }),
    },
    include: {
      kelas: {
        include: {
          tingkatan: true,
        },
      },
      tahunAjaran: true,
    },
  });

  if (!penempatan) {
    throw new AppError("Penempatan siswa tidak ditemukan", 404);
  }

  // Get all grades
  const nilaiDetail = await prisma.nilaiDetailSiswa.findMany({
    where: {
      siswaId: siswaId,
    },
    include: {
      komponen: {
        include: {
          skema: {
            include: {
              mapel: true,
            },
          },
        },
      },
      mapel: true,
    },
  });

  // Get capaian kompetensi
  const capaianKompetensi = await prisma.capaianKompetensi.findMany({
    where: {
      siswaId: siswaId,
    },
    include: {
      mapel: true,
    },
  });

  // Get rapor if exists
  const rapor = await prisma.rapor.findFirst({
    where: {
      siswaId: siswaId,
      tahunAjaranId: penempatan.tahunAjaranId,
    },
    include: {
      NilaiRaporAkhir: {
        include: {
          mapel: true,
        },
      },
    },
  });

  return {
    kelas: penempatan.kelas,
    tahunAjaran: penempatan.tahunAjaran,
    nilaiDetail: nilaiDetail,
    capaianKompetensi: capaianKompetensi,
    nilaiAkhir: rapor?.NilaiRaporAkhir || [],
  };
};

/**
 * Get student's class schedule
 */
export const getMyJadwalService = async (siswaId: string) => {
  logger.info(`Fetching schedule for siswa: ${siswaId}`);

  // Get current penempatan
  const penempatan = await prisma.penempatanSiswa.findFirst({
    where: {
      siswaId: siswaId,
    },
    include: {
      kelas: true,
      tahunAjaran: true,
    },
  });

  if (!penempatan) {
    throw new AppError("Penempatan siswa tidak ditemukan", 404);
  }

  // Get jadwal for the class
  const jadwal = await prisma.jadwal.findMany({
    where: {
      kelasId: penempatan.kelasId,
      tahunAjaranId: penempatan.tahunAjaranId,
    },
    include: {
      mapel: true,
      guru: true,
      ruangan: true,
    },
    orderBy: [
      { hari: 'asc' },
      { waktuMulai: 'asc' },
    ],
  });

  return {
    kelas: penempatan.kelas,
    tahunAjaran: penempatan.tahunAjaran,
    jadwal: jadwal,
  };
};

/**
 * Get all announcements (public)
 */
export const getPengumumanService = async () => {
  logger.info('Fetching all pengumuman');

  const pengumuman = await prisma.pengumuman.findMany({
    orderBy: {
      tanggalPublikasi: 'desc',
    },
    take: 50, // Limit to recent 50
  });

  return pengumuman;
};

/**
 * Get all documents (public)
 */
export const getDokumenService = async () => {
  logger.info('Fetching all dokumen');

  const dokumen = await prisma.dokumen.findMany({
    select: {
      id: true,
      judul: true,
      urlFile: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return dokumen;
};
