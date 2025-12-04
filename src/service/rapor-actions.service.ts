import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";

interface FinalizeRaporInput {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
}

export const finalizeRaporService = async (input: FinalizeRaporInput) => {
  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true },
  });

  if (!penempatan)
    throw new AppError("Data penempatan siswa tidak ditemukan", 404);
  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
  }

  const rapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (!rapor)
    throw new AppError(
      "Data rapor belum diinisialisasi (belum ada catatan/kokurikuler).",
      400
    );
  if (!rapor.catatanWaliKelas || !rapor.dataKokurikuler) {
    throw new AppError(
      "Catatan Wali Kelas dan Data Kokurikuler wajib diisi sebelum finalisasi.",
      400
    );
  }

  return await prisma.rapor.update({
    where: { id: rapor.id },
    data: { isFinalisasi: true },
  });
};

export const definalizeRaporService = async (input: FinalizeRaporInput) => {
  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true },
  });

  if (!penempatan)
    throw new AppError("Data penempatan siswa tidak ditemukan", 404);
  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
  }

  const rapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (!rapor) throw new AppError("Data rapor tidak ditemukan.", 404);

  return await prisma.rapor.update({
    where: { id: rapor.id },
    data: { isFinalisasi: false },
  });
};

interface OverrideNilaiInput {
  adminId: string;
  siswaId: string;
  mapelId: string;
  tahunAjaranId: string;
  nilaiAkhir: number;
}

export const overrideNilaiRaporService = async (input: OverrideNilaiInput) => {
  const rapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (!rapor)
    throw new AppError(
      "Rapor siswa belum dibuat. Harap minta Wali Kelas mengisi data awal terlebih dahulu.",
      404
    );

  return await prisma.nilaiRaporAkhir.upsert({
    where: {
      raporId_mapelId: {
        raporId: rapor.id,
        mapelId: input.mapelId,
      },
    },
    update: {
      nilaiAkhir: input.nilaiAkhir,
      isOverride: true,
    },
    create: {
      raporId: rapor.id,
      mapelId: input.mapelId,
      nilaiAkhir: input.nilaiAkhir,
      isOverride: true,
    },
  });
};
