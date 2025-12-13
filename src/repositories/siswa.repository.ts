import { prisma } from "../config/prisma";
import { UserRole } from "@prisma/client";

interface CreateSiswaInput {
  nisn: string;
  nama: string;
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  pendidikanSebelumnya?: string;
  alamat?: string;
  namaAyah?: string;
  pekerjaanAyah?: string;
  namaIbu?: string;
  pekerjaanIbu?: string;
  alamatOrtu?: string;
  namaWali?: string;
  pekerjaanWali?: string;
  alamatWali?: string;
  status?: string;
  nik?: string;
  username: string;
  passwordHash: string;
  role: UserRole;
}

export const createSiswaRepo = async (data: CreateSiswaInput) => {
  const {
    nisn,
    nama,
    jenisKelamin,
    agama,
    tempatLahir,
    tanggalLahir,
    pendidikanSebelumnya,
    alamat,
    namaAyah,
    pekerjaanAyah,
    namaIbu,
    pekerjaanIbu,
    alamatOrtu,
    namaWali,
    pekerjaanWali,
    alamatWali,
    status,
    nik,
    username,
    passwordHash,
    role,
  } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: username,
          passwordHash: passwordHash,
          role: role,
        },
      });

      const newSiswa = await tx.siswa.create({
        data: {
          nisn,
          nama,
          jenisKelamin,
          agama,
          tempatLahir,
          tanggalLahir,
          pendidikanSebelumnya,
          alamat,
          namaAyah,
          pekerjaanAyah,
          namaIbu,
          pekerjaanIbu,
          alamatOrtu,
          namaWali,
          pekerjaanWali,
          alamatWali,
          status,
          nik,
          userId: newUser.id,
        },
      });

      return { user: newUser, siswa: newSiswa };
    });
    const { passwordHash: _, ...safeUser } = result.user;

    return { user: safeUser, siswa: result.siswa };
  } catch (error) {
    throw error;
  }
};

export const getAllSiswaRepo = async (
  skip?: number,
  take?: number,
  search?: string
) => {
  const whereClause: any = { deletedAt: null };

  if (search) {
    whereClause.OR = [
      { nama: { contains: search, mode: "insensitive" } },
      { nisn: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.siswa.findMany({
    skip: skip || 0,
    take: take || 100,
    where: whereClause,
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
      nama: "asc",
    },
  });
};

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
  nisn?: string;
  nama?: string;
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  pendidikanSebelumnya?: string;
  alamat?: string;
  namaAyah?: string;
  pekerjaanAyah?: string;
  namaIbu?: string;
  pekerjaanIbu?: string;
  alamatOrtu?: string;
  namaWali?: string;
  pekerjaanWali?: string;
  alamatWali?: string;
  status?: string;
  nik?: string;
}

export const updateSiswaRepo = async (id: string, data: UpdateSiswaInput) => {
  return prisma.siswa.update({
    where: { id },
    data: {
      ...(data.nisn && { nisn: data.nisn }),
      ...(data.nama && { nama: data.nama }),
      ...(data.jenisKelamin && { jenisKelamin: data.jenisKelamin }),
      ...(data.agama && { agama: data.agama }),
      ...(data.tempatLahir && { tempatLahir: data.tempatLahir }),
      ...(data.tanggalLahir !== undefined && {
        tanggalLahir: data.tanggalLahir,
      }),
      ...(data.pendidikanSebelumnya && {
        pendidikanSebelumnya: data.pendidikanSebelumnya,
      }),
      ...(data.alamat !== undefined && { alamat: data.alamat }),
      ...(data.namaAyah && { namaAyah: data.namaAyah }),
      ...(data.pekerjaanAyah && { pekerjaanAyah: data.pekerjaanAyah }),
      ...(data.namaIbu && { namaIbu: data.namaIbu }),
      ...(data.pekerjaanIbu && { pekerjaanIbu: data.pekerjaanIbu }),
      ...(data.alamatOrtu && { alamatOrtu: data.alamatOrtu }),
      ...(data.namaWali && { namaWali: data.namaWali }),
      ...(data.pekerjaanWali && { pekerjaanWali: data.pekerjaanWali }),
      ...(data.alamatWali && { alamatWali: data.alamatWali }),
      ...(data.status && { status: data.status }),
      ...(data.nik && { nik: data.nik }),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
          updatedAt: true,
        },
      },
    },
  });
};

export const deleteSiswaRepo = async (id: string) => {
  return prisma.siswa.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
