import { prisma } from "../config/prisma";

interface CreatePengumumanInput {
  judul: string;
  konten: string;
  adminId: string; // Ini merujuk ke User ID Admin
}

/**
 * Membuat data Pengumuman baru
 */
export const createPengumumanRepo = async (data: CreatePengumumanInput) => {
  try {
    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul: data.judul,
        konten: data.konten,
        adminId: data.adminId, // Sesuai skema, ini adalah ID dari tabel User
      },
    });
    return newPengumuman;
  } catch (error) {
    throw error;
  }
};