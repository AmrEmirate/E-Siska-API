import { createRuanganRepo, updateRuanganRepo, deleteRuanganRepo } from "../repositories/ruangan.repository";
import logger from "../utils/logger";

interface CreateRuanganServiceInput {
  namaRuangan: string;
  kapasitas?: number;
  // adminId: string; // Akan kita dapatkan dari token nanti
}

export const createRuanganService = async (
  data: CreateRuanganServiceInput,
) => {
  logger.info(`Mencoba membuat ruangan: ${data.namaRuangan}`);

  // TODO: adminId harus didapat dari data user yang sedang login (via token)
  // Kita gunakan ID dummy yang sama dari tes tingkatan
  const ADMIN_ID_DUMMY = "dummy-admin-id-untuk-tes";

  const repoInput = {
    ...data,
    adminId: ADMIN_ID_DUMMY,
  };

  // Panggil Repository
  const newRuangan = await createRuanganRepo(repoInput);

  return newRuangan;
};

export const updateRuanganService = async (id: string, data: Partial<CreateRuanganServiceInput>) => {
  logger.info(`Mencoba update ruangan: ${id}`);
  
  const updateData: any = { ...data };
  // Jika ada logika khusus, tambahkan di sini

  return await updateRuanganRepo(id, updateData);
};

export const deleteRuanganService = async (id: string) => {
  logger.info(`Mencoba hapus ruangan: ${id}`);
  return await deleteRuanganRepo(id);
};