import { prisma } from "../config/prisma";
import { createPengumumanRepo } from "../repositories/pengumuman.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

interface CreatePengumumanServiceInput {
  judul: string;
  konten: string;
  target: string;
  adminId: string;
}

export const createPengumumanService = async (
  data: CreatePengumumanServiceInput
) => {
  logger.info(`Mencoba membuat pengumuman: ${data.judul}`);

  const repoInput = {
    judul: data.judul,
    konten: data.konten,
    target: data.target,
    adminId: data.adminId,
  };

  const newPengumuman = await createPengumumanRepo(repoInput);

  return newPengumuman;
};

export const getAllPengumumanService = async (
  page: number = 1,
  limit: number = 50,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const take = limit;

  logger.info(
    `Fetching all pengumuman - Page: ${page}, Limit: ${limit}, Search: ${search}`
  );

  const whereClause: any = {};
  if (search) {
    whereClause.judul = { contains: search, mode: "insensitive" };
  }

  const pengumuman = await prisma.pengumuman.findMany({
    skip,
    take,
    where: whereClause,
    orderBy: {
      tanggalPublikasi: "desc",
    },
    select: {
      id: true,
      judul: true,
      konten: true,
      target: true,
      tanggalPublikasi: true,
    },
  });

  const total = await prisma.pengumuman.count({ where: whereClause });

  return {
    data: pengumuman,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPengumumanByIdService = async (id: string) => {
  logger.info(`Fetching pengumuman: ${id}`);

  const pengumuman = await prisma.pengumuman.findUnique({
    where: { id },
    select: {
      id: true,
      judul: true,
      konten: true,
      target: true,
      tanggalPublikasi: true,
    },
  });

  if (!pengumuman) {
    throw new AppError("Pengumuman tidak ditemukan", 404);
  }

  return pengumuman;
};

export const updatePengumumanService = async (
  id: string,
  data: Partial<CreatePengumumanServiceInput>
) => {
  logger.info(`Updating pengumuman: ${id}`);

  const pengumuman = await prisma.pengumuman.findUnique({
    where: { id },
  });

  if (!pengumuman) {
    throw new AppError("Pengumuman tidak ditemukan", 404);
  }

  const updated = await prisma.pengumuman.update({
    where: { id },
    data: {
      ...(data.judul && { judul: data.judul }),
      ...(data.konten && { konten: data.konten }),
      ...(data.target && { target: data.target }),
    },
  });

  return updated;
};

export const deletePengumumanService = async (id: string) => {
  logger.info(`Deleting pengumuman: ${id}`);

  const pengumuman = await prisma.pengumuman.findUnique({
    where: { id },
  });

  if (!pengumuman) {
    throw new AppError("Pengumuman tidak ditemukan", 404);
  }

  await prisma.pengumuman.delete({
    where: { id },
  });

  return { message: "Pengumuman berhasil dihapus" };
};
