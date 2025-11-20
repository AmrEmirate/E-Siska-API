import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

/**
 * Get rekap nilai for all students in wali kelas's class
 */
export const getRekapNilaiKelasService = async (guruId: string, kelasId: string) => {
  logger.info(`Guru ${guruId} fetching rekap nilai for kelas ${kelasId}`);

  // Verify that guru is wali kelas of this class
  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Kelas tidak ditemukan", 404);
  }

  if (kelas.waliKelasId !== guruId) {
    throw new AppError("Anda bukan wali kelas dari kelas ini", 403);
  }

  // Get all students in this class
  const siswaList = await prisma.penempatanSiswa.findMany({
    where: {
      kelasId: kelasId,
    },
    include: {
      siswa: true,
      tahunAjaran: true,
    },
  });

  // Get nilai for each student
  const rekapNilai = await Promise.all(
    siswaList.map(async (penempatan: any) => {
      // Get rapor if exists
      const rapor = await prisma.rapor.findFirst({
        where: {
          siswaId: penempatan.siswaId,
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
        siswa: penempatan.siswa,
        rapor: rapor,
        nilaiAkhir: rapor?.NilaiRaporAkhir || [],
      };
    })
  );

  return {
    kelas: kelas,
    siswaList: rekapNilai,
  };
};

/**
 * Get rekap absensi for all students in wali kelas's class
 */
export const getRekapAbsensiKelasService = async (guruId: string, kelasId: string) => {
  logger.info(`Guru ${guruId} fetching rekap absensi for kelas ${kelasId}`);

  // Verify that guru is wali kelas of this class
  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Kelas tidak ditemukan", 404);
  }

  if (kelas.waliKelasId !== guruId) {
    throw new AppError("Anda bukan wali kelas dari kelas ini", 403);
  }

  // Get all students in this class
  const siswaList = await prisma.penempatanSiswa.findMany({
    where: {
      kelasId: kelasId,
    },
    include: {
      siswa: true,
    },
  });

  // Get absensi summary for each student
  const rekapAbsensi = await Promise.all(
    siswaList.map(async (penempatan: any) => {
      const absensiDetails = await prisma.absensiDetail.findMany({
        where: {
          siswaId: penempatan.siswaId,
          sesi: {
            kelasId: kelasId,
          },
        },
      });

      const summary = {
        hadir: absensiDetails.filter(a => a.status === 'HADIR').length,
        sakit: absensiDetails.filter(a => a.status === 'SAKIT').length,
        izin: absensiDetails.filter(a => a.status === 'IZIN').length,
        alpha: absensiDetails.filter(a => a.status === 'ALPHA').length,
        total: absensiDetails.length,
      };

      return {
        siswa: penempatan.siswa,
        summary: summary,
      };
    })
  );

  return {
    kelas: kelas,
    rekapAbsensi: rekapAbsensi,
  };
};

/**
 * Get all students data in wali kelas's class
 */
export const getDataSiswaBimbinganService = async (guruId: string, kelasId: string) => {
  logger.info(`Guru ${guruId} fetching data siswa for kelas ${kelasId}`);

  // Verify that guru is wali kelas of this class
  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Kelas tidak ditemukan", 404);
  }

  if (kelas.waliKelasId !== guruId) {
    throw new AppError("Anda bukan wali kelas dari kelas ini", 403);
  }

  // Get all students in this class
  const siswaList = await prisma.penempatanSiswa.findMany({
    where: {
      kelasId: kelasId,
    },
    include: {
      siswa: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      tahunAjaran: true,
    },
    orderBy: {
      siswa: {
        nama: 'asc',
      },
    },
  });

  return {
    kelas: kelas,
    totalSiswa: siswaList.length,
    siswaList: siswaList.map((p: any) => ({
      ...p.siswa,
      tahunAjaran: p.tahunAjaran,
    })),
  };
};

/**
 * Get wali kelas's own class (if assigned)
 */
export const getMyKelasService = async (guruId: string) => {
  logger.info(`Guru ${guruId} fetching own kelas as wali kelas`);

  const kelas = await prisma.kelas.findFirst({
    where: {
      waliKelasId: guruId,
    },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Anda belum ditugaskan sebagai wali kelas", 404);
  }

  // Get student count
  const studentCount = await prisma.penempatanSiswa.count({
    where: {
      kelasId: kelas.id,
    },
  });

  return {
    ...kelas,
    jumlahSiswa: studentCount,
  };
};
