import { createTahunAjaranRepo } from "../repositories/tahunAjaran.repository";
import logger from "../utils/logger";

interface CreateTahunAjaranServiceInput {
  nama: string;
  // adminId: string; // Akan kita dapatkan dari token nanti
}

export const createTahunAjaranService = async (
  data: CreateTahunAjaranServiceInput,
) => {
  logger.info(`Mencoba membuat Tahun Ajaran: ${data.nama}`);

  // TODO: adminId harus didapat dari data user yang sedang login (via token)
  const ADMIN_ID_DUMMY = "dummy-admin-id-untuk-tes"; // Ganti ini

  const repoInput = {
    nama: data.nama,
    adminId: ADMIN_ID_DUMMY,
  };

  // Panggil Repository
  const newTahunAjaran = await createTahunAjaranRepo(repoInput);

  return newTahunAjaran;
};