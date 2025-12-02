import { prisma } from "../config/prisma";

interface CreatePengumumanInput {
  judul: string;
  konten: string;
  target: string;
  adminId: string;
}

export const createPengumumanRepo = async (data: CreatePengumumanInput) => {
  try {
    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul: data.judul,
        konten: data.konten,
        target: data.target,
        adminId: data.adminId,
      },
    });
    return newPengumuman;
  } catch (error) {
    throw error;
  }
};
