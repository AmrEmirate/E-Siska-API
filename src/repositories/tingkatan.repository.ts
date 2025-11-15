import { prisma } from "../config/prisma";

/**
 * Membuat data Tingkatan Kelas baru (Versi Sederhana Tanpa AdminId)
 */
export const createTingkatanRepo = async (namaTingkat: string) => {
  try {
    const newTingkatan = await prisma.tingkatanKelas.create({
      data: {
        namaTingkat: namaTingkat,
        // adminId akan ditambahkan nanti saat auth sudah siap
        // Untuk sementara, skema HARUS diubah agar adminId opsional (?)
        // atau kita pakai adminId dummy
        adminId: "dummy-admin-id-untuk-tes", // Pastikan ID ini ADA di db
      },
    });
    return newTingkatan;
  } catch (error) {
    throw error;
  }
};