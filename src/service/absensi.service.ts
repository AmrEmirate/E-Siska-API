import {
  createSesiRepo,
  findSesiByKelasRepo,
  findSesiByIdRepo,
} from "../repositories/absensi.repository";
import {
  findAbsensiBySiswaRepo,
  findAbsensiByKelasRepo,
} from "../repositories/absensiDetail.repository";
import { getKelasByIdWithStudentsRepo } from "../repositories/kelas.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreateSesiServiceInput {
  guruId: string;
  kelasId: string;
  tanggal: string;
  pertemuanKe: number;
}

export const createSesiService = async (data: CreateSesiServiceInput) => {
  logger.info(`Mencoba membuat sesi absensi untuk kelas ${data.kelasId}`);

  const penugasan = await prisma.penugasanGuru.findFirst({
    where: {
      guruId: data.guruId,
      kelasId: data.kelasId,
    },
  });

  if (!penugasan) {
    throw new AppError(
      "Guru tidak terdaftar mengajar di kelas ini. Tidak bisa membuat sesi.",
      403
    );
  }

  const tanggalObj = new Date(data.tanggal);

  const existingSesi = await prisma.absensiSesi.findUnique({
    where: {
      kelasId_tanggal_pertemuanKe: {
        kelasId: data.kelasId,
        tanggal: tanggalObj,
        pertemuanKe: data.pertemuanKe,
      },
    },
  });

  if (existingSesi) {
    throw new AppError(
      `Sesi pertemuan ke-${data.pertemuanKe} pada tanggal tersebut sudah dibuat.`,
      409
    );
  }

  const newSesi = await createSesiRepo({
    guruId: data.guruId,
    kelasId: data.kelasId,
    tanggal: tanggalObj,
    pertemuanKe: data.pertemuanKe,
  });

  return newSesi;
};

export const getSesiByKelasService = async (kelasId: string) => {
  logger.info(`Fetching sessions for class: ${kelasId}`);
  return await findSesiByKelasRepo(kelasId);
};

export const getSesiDetailService = async (sesiId: string) => {
  logger.info(`Fetching session detail: ${sesiId}`);

  const sesi = await findSesiByIdRepo(sesiId);
  if (!sesi) {
    throw new AppError("Sesi absensi tidak ditemukan", 404);
  }

  if (sesi.Detail && sesi.Detail.length > 0) {
    return {
      ...sesi,
      students: sesi.Detail.map((detail) => ({
        siswaId: detail.siswaId,
        nama: detail.siswa.nama,
        nisn: detail.siswa.nisn,
        status: detail.status,
      })),
    };
  }

  const kelas = await getKelasByIdWithStudentsRepo(sesi.kelasId);
  if (!kelas) {
    throw new AppError("Data kelas tidak ditemukan", 404);
  }

  const students = kelas.Penempatan.map((p) => ({
    siswaId: p.siswa.id,
    nama: p.siswa.nama,
    nisn: p.siswa.nisn,
    status: null,
  }));

  return {
    ...sesi,
    students,
  };
};

export const getAbsensiByStudentService = async (siswaId: string) => {
  logger.info(`Fetching absensi for student: ${siswaId}`);
  const absensi = await findAbsensiBySiswaRepo(siswaId);

  return absensi.map((a) => ({
    id: a.id,
    siswaId: a.siswaId,
    kelasId: a.sesi.kelasId,
    tanggal: a.sesi.tanggal,
    status: a.status,
    kelas: a.sesi.kelas,
  }));
};

export const getAbsensiByKelasService = async (kelasId: string) => {
  logger.info(`Fetching absensi for class: ${kelasId}`);
  const absensi = await findAbsensiByKelasRepo(kelasId);

  return absensi.map((a) => ({
    id: a.id,
    siswaId: a.siswaId,
    kelasId: a.sesi.kelasId,
    tanggal: a.sesi.tanggal,
    status: a.status,
    kelas: a.sesi.kelas,
    siswa: a.siswa,
  }));
};
