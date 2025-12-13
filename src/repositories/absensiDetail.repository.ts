import { prisma } from "../config/prisma";
import { AbsensiStatus } from "@prisma/client";

export interface AbsensiInputItem {
  siswaId: string;
  status: AbsensiStatus;
}

export const upsertAbsensiDetailRepo = async (
  sesiId: string,
  dataSiswa: AbsensiInputItem[]
) => {
  return prisma.$transaction(
    dataSiswa.map((item) =>
      prisma.absensiDetail.upsert({
        where: {
          siswaId_sesiId: {
            sesiId: sesiId,
            siswaId: item.siswaId,
          },
        },
        update: {
          status: item.status,
        },
        create: {
          sesiId: sesiId,
          siswaId: item.siswaId,
          status: item.status,
        },
      })
    )
  );
};

export const findAbsensiBySiswaRepo = async (siswaId: string) => {
  return prisma.absensiDetail.findMany({
    where: {
      siswaId: siswaId,
    },
    include: {
      sesi: {
        include: {
          kelas: true,
        },
      },
    },
    orderBy: {
      sesi: {
        tanggal: "desc",
      },
    },
  });
};

export const findAbsensiByKelasRepo = async (kelasId: string) => {
  return prisma.absensiDetail.findMany({
    where: {
      sesi: {
        kelasId: kelasId,
      },
    },
    include: {
      siswa: true,
      sesi: {
        include: {
          kelas: true,
        },
      },
    },
    orderBy: {
      sesi: {
        tanggal: "desc",
      },
    },
  });
};
