import { upsertRaporRepo } from "../repositories/rapor.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import {
  getAbsensiSummaryRepo,
  getNilaiRaporRepo,
  getNilaiEkskulRepo,
  getRaporDataRepo,
  getRaporBySiswaIdRepo,
} from "../repositories/rapor.repository";

interface InputRaporService {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
  catatan?: string;
  kokurikuler?: string;
}

export const inputDataRaporService = async (input: InputRaporService) => {
  logger.info(
    `Mencoba update data rapor siswa ${input.siswaId} oleh guru ${input.guruId}`
  );

  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true },
  });

  if (!penempatan) {
    throw new AppError(
      "Siswa belum ditempatkan di kelas untuk tahun ajaran ini.",
      404
    );
  }

  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas dari siswa ini.", 403);
  }

  const existingRapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (existingRapor?.isFinalisasi) {
    throw new AppError(
      "Rapor sudah difinalisasi. Lakukan definalisasi terlebih dahulu untuk mengubah data.",
      400
    );
  }

  const result = await upsertRaporRepo({
    siswaId: input.siswaId,
    tahunAjaranId: input.tahunAjaranId,
    kelasId: penempatan.kelasId,
    waliKelasId: input.guruId,
    catatanWaliKelas: input.catatan,
    dataKokurikuler: input.kokurikuler,
  });

  return result;
};

interface GenerateRaporInput {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
}

export const generateRaporService = async (input: GenerateRaporInput) => {
  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true, siswa: true, tahunAjaran: true },
  });

  if (!penempatan)
    throw new AppError("Data penempatan siswa tidak ditemukan", 404);

  // Note: Access control is handled by middleware (authMiddleware, guruGuard, waliKelasGuard)
  // This service focuses on data generation only

  const [absensi, nilaiData, ekskulData, dataRapor] = await Promise.all([
    getAbsensiSummaryRepo(input.siswaId, input.tahunAjaranId),
    getNilaiRaporRepo(input.siswaId),
    getNilaiEkskulRepo(input.siswaId),
    getRaporDataRepo(input.siswaId, input.tahunAjaranId),
  ]);

  const mapelMap = new Map();

  nilaiData.nilaiDetails.forEach((n) => {
    const mapelName = n.mapel.namaMapel;
    if (!mapelMap.has(mapelName)) {
      mapelMap.set(mapelName, {
        kkm: 75,
        nilaiAkhir: 0,
        predikat: "",
        deskripsi: "",
      });
    }

    if (
      n.komponen?.namaKomponen === "Nilai Akhir" ||
      (n.komponen?.tipe === "READ_ONLY" && n.nilaiAngka)
    ) {
      const current = mapelMap.get(mapelName);
      current.nilaiAkhir = n.nilaiAngka || 0;
      current.predikat =
        current.nilaiAkhir >= 90 ? "A" : current.nilaiAkhir >= 80 ? "B" : "C";
    }
  });

  nilaiData.capaianDetails.forEach((c) => {});

  const nilaiAkademik = Array.from(mapelMap, ([nama, val]) => ({
    mapel: nama,
    ...val,
  }));

  const ekstrakurikuler = ekskulData.map((e) => ({
    nama: e.mapel.namaMapel,
    nilai: "A",
    deskripsi: e.nilaiDeskripsi,
  }));

  return {
    infoSiswa: {
      nama: penempatan.siswa.nama,
      nisn: penempatan.siswa.nisn,
      kelas: penempatan.kelas.namaKelas,
      tahunAjaran: penempatan.tahunAjaran.nama,
    },
    nilaiAkademik,
    ekstrakurikuler,
    ketidakhadiran: absensi,
    catatanWaliKelas: dataRapor?.catatanWaliKelas || "-",
    dataKokurikuler: dataRapor?.dataKokurikuler || "-",
    status: dataRapor?.isFinalisasi ? "FINAL" : "DRAFT",
    tanggalCetak: new Date(),
  };
};

export const getMyRaporService = async (siswaId: string) => {
  logger.info(`Fetching reports for student: ${siswaId}`);
  const rapors = await getRaporBySiswaIdRepo(siswaId);
  return rapors;
};
