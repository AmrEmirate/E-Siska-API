import { prisma } from "../config/prisma";
import { createPengumumanRepo } from "../repositories/pengumuman.repository";
import logger from "../utils/logger";
// import AppError from "../utils/AppError";
// import { prisma } from "../config/prisma";

interface CreatePengumumanServiceInput {
  judul: string;
  konten: string;
  // adminUserId: string; // Akan kita dapatkan dari token nanti
}

export const createPengumumanService = async (
  data: CreatePengumumanServiceInput,
) => {
  logger.info(`Mencoba membuat pengumuman: ${data.judul}`);

  // TODO: adminUserId harus didapat dari data user (Admin) yang sedang login
  // Kita gunakan USER_ID dari admin dummy yang dibuat di tes-tes sebelumnya
  const ADMIN_USER_ID_DUMMY = (await prisma.admin.findFirst({
      where: { id: "dummy-admin-id-untuk-tes" },
      include: { user: true }
  }))?.user.id || "dummy-admin-user-id"; // fallback


  const repoInput = {
    judul: data.judul,
    konten: data.konten,
    adminId: ADMIN_USER_ID_DUMMY,
  };

  // Panggil Repository
  const newPengumuman = await createPengumumanRepo(repoInput);

  return newPengumuman;
};