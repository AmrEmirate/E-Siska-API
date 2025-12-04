import {
  createKelasRepo,
  updateKelasRepo,
  deleteKelasRepo,
  findAllKelasRepo,
  getKelasByWaliKelasRepo,
  getKelasByGuruIdRepo,
} from "../repositories/kelas.repository";
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

  const tingkatan = await prisma.tingkatanKelas.findUnique({
    where: { id: data.tingkatanId },
  });
  if (!tingkatan) {
    throw new AppError("Tingkatan Kelas tidak ditemukan", 404);
  }

  if (data.waliKelasId) {
    const guru = await prisma.guru.findUnique({
      where: { id: data.waliKelasId },
      include: { user: true },
    });
    if (!guru) {
      throw new AppError("Guru (calon Wali Kelas) tidak ditemukan", 404);
    }

    if (guru.userId) {
      await prisma.user.update({
        where: { id: guru.userId },
        data: { isWaliKelas: true },
      });
    }
  }

  const newKelas = await createKelasRepo(data);
  return newKelas;
};

export const updateKelasService = async (
  id: string,
  data: Partial<CreateKelasServiceInput>
) => {
  logger.info(`Mencoba update kelas: ${id}`);

  const existingKelas = await prisma.kelas.findUnique({
    where: { id },
    include: { waliKelas: { include: { user: true } } },
  });

  if (data.waliKelasId) {
    const newGuru = await prisma.guru.findUnique({
      where: { id: data.waliKelasId },
      include: { user: true },
    });
    if (!newGuru) {
      throw new AppError("Guru (calon Wali Kelas) tidak ditemukan", 404);
    }

    if (
      existingKelas?.waliKelas?.userId &&
      existingKelas.waliKelasId !== data.waliKelasId
    ) {
      const stillWali = await prisma.kelas.findFirst({
        where: {
          waliKelasId: existingKelas.waliKelasId,
          id: { not: id },
        },
      });
      if (!stillWali) {
        await prisma.user.update({
          where: { id: existingKelas.waliKelas.userId },
          data: { isWaliKelas: false },
        });
      }
    }

    if (newGuru.userId) {
      await prisma.user.update({
        where: { id: newGuru.userId },
        data: { isWaliKelas: true },
      });
    }
  }

  return await updateKelasRepo(id, data);
};

export const deleteKelasService = async (id: string) => {
  logger.info(`Mencoba hapus kelas: ${id}`);
  return await deleteKelasRepo(id);
};

export const getAllKelasService = async (search?: string) => {
  logger.info(`Fetching all kelas, search: ${search}`);
  return await findAllKelasRepo(search);
};

export const getMyClassService = async (guruId: string) => {
  logger.info(`Fetching class for wali kelas: ${guruId}`);
  const kelas = await getKelasByWaliKelasRepo(guruId);

  if (!kelas) {
    throw new AppError(
      "Anda tidak terdaftar sebagai Wali Kelas untuk kelas manapun.",
      404
    );
  }

  return kelas;
};

export const getMyTeachingClassesService = async (guruId: string) => {
  logger.info(`Fetching teaching classes for guru: ${guruId}`);
  return await getKelasByGuruIdRepo(guruId);
};
