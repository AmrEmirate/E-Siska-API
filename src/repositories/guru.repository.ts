import { prisma } from "../config/prisma";
import { UserRole } from "../generated/prisma";

// Tipe data input untuk repository
interface CreateGuruInput {
  nip: string;
  nama: string;
  email?: string;
  username: string; // Username untuk login
  passwordHash: string;
  role: UserRole;
}

/**
 * Membuat data Guru dan User baru dalam satu transaksi
 */
export const createGuruRepo = async (data: CreateGuruInput) => {
  const { nip, nama, email, username, passwordHash, role } = data;

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

      // 2. Buat Guru baru, hubungkan dengan userId
      const newGuru = await tx.guru.create({
        data: {
          nip: nip,
          nama: nama,
          email: email,
          userId: newUser.id, // Menghubungkan ke User
        },
      });

      return { user: newUser, guru: newGuru };
    });

    // Hapus passwordHash dari response
    const { passwordHash: _, ...safeUser } = result.user;

    return { user: safeUser, guru: result.guru };
  } catch (error) {
    // Tangani jika ada error, misal NIP/Username duplikat
    throw error;
  }
};

/**
 * Get all Guru with optional pagination
 */
export const getAllGuruRepo = async (skip?: number, take?: number) => {
  return prisma.guru.findMany({
    skip: skip || 0,
    take: take || 100,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
          isWaliKelas: true,
        },
      },
      KelasBimbingan: true,
    },
    orderBy: {
      nama: 'asc',
    },
  });
};

/**
 * Get Guru by ID with user data
 */
export const getGuruByIdRepo = async (id: string) => {
  return prisma.guru.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
          isWaliKelas: true,
        },
      },
      KelasBimbingan: true,
      Penugasan: {
        include: {
          mapel: true,
          kelas: true,
        },
      },
    },
  });
};

interface UpdateGuruInput {
  nip?: string;
  nama?: string;
  email?: string;
}

/**
 * Update Guru data
 */
export const updateGuruRepo = async (id: string, data: UpdateGuruInput) => {
  return prisma.guru.update({
    where: { id },
    data: {
      ...(data.nip && { nip: data.nip }),
      ...(data.nama && { nama: data.nama }),
      ...(data.email !== undefined && { email: data.email }),
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
 * Delete Guru (cascade delete user via Prisma schema)
 */
export const deleteGuruRepo = async (id: string) => {
  return prisma.guru.delete({
    where: { id },
  });
};