import { prisma } from "../config/prisma";
// Hapus hashPassword, karena repository hanya bertugas mengambil data
// Hashing adalah logika bisnis, tempatnya di service

/**
 * Mencari satu user berdasarkan username unik
 * @param username string
 * @returns data user (termasuk password hash) atau null
 */
export const findUserByUsernameRepo = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};

/* Fungsi createAccount dari file lama
tidak akan kita pakai di sini, karena pembuatan user 
sudah ditangani oleh repository spesifik (seperti siswa.repository.ts)
*/