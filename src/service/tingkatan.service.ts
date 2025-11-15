import { createTingkatanRepo } from "../repositories/tingkatan.repository";
import logger from "../utils/logger";

export const createTingkatanService = async (namaTingkat: string) => {
  logger.info(`Mencoba membuat tingkatan kelas: ${namaTingkat}`);
  
  // Langsung panggil repo
  const newTingkatan = await createTingkatanRepo(namaTingkat);

  return newTingkatan;
};