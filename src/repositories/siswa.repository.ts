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

/**
 * Get all Students with optional pagination
 */
export const getAllSiswaRepo = async (skip?: number, take?: number) => {
  return prisma.siswa.findMany({
    skip: skip || 0,
    take: take || 100,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
    orderBy: {
      nama: 'asc',
    },
  });
};

/**
 * Get Student by ID with user data
 */
export const getSiswaByIdRepo = async (id: string) => {
  return prisma.siswa.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
      Penempatan: {
        include: {
          kelas: true,
          tahunAjaran: true,
        },
      },
    },
  });
};

interface UpdateSiswaInput {
  nis?: string;
  nama?: string;
  tanggalLahir?: Date;
  alamat?: string;
}

/**
 * Update Student data
 */
export const updateSiswaRepo = async (id: string, data: UpdateSiswaInput) => {
  return prisma.siswa.update({
    where: { id },
    data: {
      ...(data.nis && { nis: data.nis }),
      ...(data.nama && { nama: data.nama }),
      ...(data.tanggalLahir !== undefined && { tanggalLahir: data.tanggalLahir }),
      ...(data.alamat !== undefined && { alamat: data.alamat }),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Delete Student (cascade delete user via Prisma schema)
 */
export const deleteSiswaRepo = async (id: string) => {
  return prisma.siswa.delete({
    where: { id },
  });
};