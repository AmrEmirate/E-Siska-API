import { prisma } from "../config/prisma";
import { UserRole } from "../generated/prisma"; // Impor Enum Role

// Tipe data ini bisa dipindah ke file 'types' nanti
interface CreateSiswaInput {
  nis: string;
  nama: string;
  tanggalLahir?: Date;
  alamat?: string;
  username: string; // Ini adalah NIS
  passwordHash: string;
  role: UserRole;
}

/**
 * Membuat data Siswa dan User baru dalam satu transaksi
 */
export const createSiswaRepo = async (data: CreateSiswaInput) => {
  const { nis, nama, tanggalLahir, alamat, username, passwordHash, role } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat User baru
      const newUser = await tx.user.create({
        data: {
          username: username,
          passwordHash: passwordHash,
          role: role,
        },
      });

      // 2. Buat Siswa baru, hubungkan dengan userId yang baru dibuat
      const newSiswa = await tx.siswa.create({
        data: {
          nis: nis,
          nama: nama,
          tanggalLahir: tanggalLahir,
          alamat: alamat,
          userId: newUser.id, // Menghubungkan ke User
        },
      });

      return { user: newUser, siswa: newSiswa };
    });

    // Hapus passwordHash dari response
    const { passwordHash: _, ...safeUser } = result.user;

    return { user: safeUser, siswa: result.siswa };
  } catch (error) {
    // Tangani jika ada error, misal NIS/Username duplikat
    throw error;
  }
};