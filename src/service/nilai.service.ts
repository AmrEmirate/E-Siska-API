import {
  upsertNilaiRepo,
  InputNilaiItem,
  getNilaiKelasRepo,
  getNilaiBySiswaIdRepo,
  getAllNilaiRepo,
  updateNilaiRepo,
  deleteNilaiRepo,
} from "../repositories/nilai.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import { NilaiKomponenType } from "../generated/prisma";
import { calculateGradesService } from "./kalkulasi.service";

interface InputNilaiServiceInput {
  guruId: string;
  mapelId: string;
  komponenId: string;
  data: {
    siswaId: string;
    nilai?: number | null;
    nilaiDeskripsi?: string | null;
  }[];
}

export const inputNilaiService = async (input: InputNilaiServiceInput) => {
  logger.info(
    `Mencoba input nilai untuk mapel ${input.mapelId}, komponen ${input.komponenId}`
  );

  const penugasan = await prisma.penugasanGuru.findFirst({
    where: {
      guruId: input.guruId,
      mapelId: input.mapelId,
    },
  });

  if (!penugasan) {
    throw new AppError(
      "Anda tidak terdaftar sebagai pengajar mata pelajaran ini.",
      403
    );
  }

  const komponen = await prisma.nilaiKomponen.findUnique({
    where: { id: input.komponenId },
    include: { skema: true },
  });

  if (!komponen) {
    throw new AppError("Komponen nilai tidak ditemukan.", 404);
  }

  if (komponen.skema.mapelId !== input.mapelId) {
    throw new AppError(
      "Komponen nilai ini tidak milik mata pelajaran yang dipilih.",
      400
    );
  }

  if (komponen.tipe !== NilaiKomponenType.INPUT) {
    throw new AppError(
      "Anda hanya dapat menginput nilai pada komponen bertipe INPUT. Komponen READ_ONLY dihitung otomatis.",
      400
    );
  }

  const result = await upsertNilaiRepo(
    input.guruId,
    input.mapelId,
    input.komponenId,
    input.data
  );

  const affectedSiswaIds = input.data.map((d) => d.siswaId);
  await calculateGradesService(input.mapelId, affectedSiswaIds);

  return result;
};

export const getNilaiKelasService = async (
  guruId: string,
  kelasId: string,
  mapelId: string
) => {
  const { students, grades } = await getNilaiKelasRepo(kelasId, mapelId);
  const mapel = await prisma.mataPelajaran.findUnique({
    where: { id: mapelId },
  });
  const isEkskul = mapel?.kategori === "EKSTRAKURIKULER";

  const formattedData = students.map((p) => {
    const studentGrades = grades.filter((g) => g.siswaId === p.siswaId);

    const gradesMap: Record<string, number | string> = {};
    studentGrades.forEach((g) => {
      if (g.komponenId) {
        if (isEkskul) {
          if (g.nilaiDeskripsi !== null) {
            gradesMap[g.komponenId] = g.nilaiDeskripsi;
          } else if (g.nilaiAngka !== null) {
            gradesMap[g.komponenId] = g.nilaiAngka;
          }
        } else {
          if (g.nilaiAngka !== null) {
            gradesMap[g.komponenId] = g.nilaiAngka;
          } else if (g.nilaiDeskripsi !== null) {
            gradesMap[g.komponenId] = g.nilaiDeskripsi;
          }
        }
      }
    });

    return {
      siswaId: p.siswaId,
      nisn: p.siswa.nisn,
      nama: p.siswa.nama,
      grades: gradesMap,
    };
  });

  return formattedData;
};

export const getMyGradesService = async (siswaId: string) => {
  logger.info(`Fetching grades for student: ${siswaId}`);
  const grades = await getNilaiBySiswaIdRepo(siswaId);

  const groupedGrades: Record<string, any> = {};

  grades.forEach((g) => {
    const mapelName = g.mapel.namaMapel;
    if (!groupedGrades[mapelName]) {
      groupedGrades[mapelName] = {
        mapel: mapelName,
        kategori: g.mapel.kategori,
        components: [],
      };
    }

    groupedGrades[mapelName].components.push({
      komponen: g.komponen?.namaKomponen || "Unknown",
      tipe: g.komponen?.tipe,
      nilai: g.nilaiAngka,
      nilaiDeskripsi: g.nilaiDeskripsi,
      guru: g.guru.nama,
    });
  });

  return Object.values(groupedGrades);
};

export const getAllNilaiService = async (filters?: {
  siswaId?: string;
  mapelId?: string;
  tahunAjaranId?: string;
}) => {
  logger.info(`Fetching all nilai with filters: ${JSON.stringify(filters)}`);
  const data = await getAllNilaiRepo(filters);

  return data.map((nilai) => ({
    id: nilai.id,
    siswaId: nilai.siswaId,
    mapelId: nilai.mapelId,
    komponenId: nilai.komponenId,
    nilai: nilai.nilaiAngka,
    siswa: nilai.siswa,
    mapel: nilai.mapel,
    skema: nilai.komponen,
  }));
};

export const updateNilaiService = async (
  id: string,
  nilai: number,
  guruId: string
) => {
  logger.info(`Updating nilai ${id} with new value: ${nilai}`);

  const existingNilai = await prisma.nilaiDetailSiswa.findUnique({
    where: { id },
    include: { komponen: true },
  });

  if (!existingNilai) {
    throw new AppError("Nilai tidak ditemukan.", 404);
  }

  if (existingNilai.komponen?.tipe !== NilaiKomponenType.INPUT) {
    throw new AppError(
      "Anda hanya dapat mengubah nilai pada komponen bertipe INPUT.",
      400
    );
  }

  const result = await updateNilaiRepo(id, nilai, guruId);
  await calculateGradesService(result.mapelId, [result.siswaId]);

  return result;
};

export const deleteNilaiService = async (id: string) => {
  logger.info(`Deleting nilai ${id}`);

  const existingNilai = await prisma.nilaiDetailSiswa.findUnique({
    where: { id },
    include: { komponen: true },
  });

  if (!existingNilai) {
    throw new AppError("Nilai tidak ditemukan.", 404);
  }

  if (existingNilai.komponen?.tipe !== NilaiKomponenType.INPUT) {
    throw new AppError(
      "Anda hanya dapat menghapus nilai pada komponen bertipe INPUT.",
      400
    );
  }

  const result = await deleteNilaiRepo(id);
  await calculateGradesService(existingNilai.mapelId, [existingNilai.siswaId]);

  return result;
};

// Service untuk wali kelas - mendapatkan semua nilai siswa di kelasnya
export const getNilaiByKelasOnlyService = async (kelasId: string) => {
  logger.info(`Fetching all grades for kelas: ${kelasId}`);

  // Get all students in this class
  const penempatan = await prisma.penempatanSiswa.findMany({
    where: { kelasId },
    include: {
      siswa: true,
    },
  });

  if (penempatan.length === 0) {
    return [];
  }

  const siswaIds = penempatan.map((p) => p.siswaId);

  // Get all grades for these students
  const allGrades = await prisma.nilaiDetailSiswa.findMany({
    where: {
      siswaId: { in: siswaIds },
    },
    include: {
      siswa: true,
      mapel: true,
      komponen: true,
    },
    orderBy: [{ siswa: { nama: "asc" } }, { mapel: { namaMapel: "asc" } }],
  });

  // Return flat array format matching frontend expectations
  return allGrades.map((grade) => ({
    siswaId: grade.siswaId,
    siswa: {
      id: grade.siswa.id,
      nisn: grade.siswa.nisn,
      nama: grade.siswa.nama,
    },
    mapelId: grade.mapelId,
    mapel: {
      id: grade.mapel.id,
      namaMapel: grade.mapel.namaMapel,
    },
    komponenId: grade.komponenId,
    komponen: grade.komponen
      ? {
          id: grade.komponen.id,
          namaKomponen: grade.komponen.namaKomponen,
          tipe: grade.komponen.tipe,
        }
      : null,
    nilai: grade.nilaiAngka,
    nilaiDeskripsi: grade.nilaiDeskripsi,
  }));
};
