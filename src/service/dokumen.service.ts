import { createDokumenRepo } from "../repositories/dokumen.repository";
import logger from "../utils/logger";
import { cloudinaryUpload } from "../config/cloudinary";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreateDokumenServiceInput {
  judul: string;
  file: Express.Multer.File;
}

export const createDokumenService = async (
  data: CreateDokumenServiceInput,
) => {
  logger.info(`Mencoba mengupload dokumen: ${data.judul}`);

  // 1. Upload file ke Cloudinary
  const uploadResult = await cloudinaryUpload(data.file);
  logger.info(`File berhasil diupload ke Cloudinary: ${uploadResult.secure_url}`);

  // TODO: adminUserId harus didapat dari data user (Admin) yang sedang login
  const ADMIN_USER_ID_DUMMY = (await prisma.admin.findFirst({
      where: { id: "dummy-admin-id-untuk-tes" },
      include: { user: true }
  }))?.user.id || "dummy-admin-user-id";

  // 2. Siapkan data untuk repository
  const repoInput = {
    judul: data.judul,
    urlFile: uploadResult.secure_url,
    adminId: ADMIN_USER_ID_DUMMY,
  };

  // 3. Panggil Repository
  const newDokumen = await createDokumenRepo(repoInput);

  return newDokumen;
};

/**
 * Get all documents with pagination
 */
export const getAllDokumenService = async (page: number = 1, limit: number = 50) => {
  const skip = (page - 1) * limit;
  const take = limit;

  logger.info(`Fetching all dokumen - Page: ${page}, Limit: ${limit}`);

  const dokumen = await prisma.dokumen.findMany({
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      judul: true,
      urlFile: true,
      createdAt: true,
    },
  });

  const total = await prisma.dokumen.count();

  return {
    data: dokumen,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Delete dokumen by ID
 */
export const deleteDokumenService = async (id: string) => {
  logger.info(`Deleting dokumen: ${id}`);

  // Check if dokumen exists
  const dokumen = await prisma.dokumen.findUnique({
    where: { id },
  });

  if (!dokumen) {
    throw new AppError("Dokumen tidak ditemukan", 404);
  }

  // Delete from database
  await prisma.dokumen.delete({
    where: { id },
  });

  return { message: "Dokumen berhasil dihapus" };
};