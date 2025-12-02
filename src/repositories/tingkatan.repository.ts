import { prisma } from "../config/prisma";

export const createTingkatanRepo = async (
  namaTingkat: string,
  adminId: string
) => {
  try {
    const newTingkatan = await prisma.tingkatanKelas.create({
      data: {
        namaTingkat: namaTingkat,
        adminId: adminId,
      },
    });
    return newTingkatan;
  } catch (error) {
    throw error;
  }
};
