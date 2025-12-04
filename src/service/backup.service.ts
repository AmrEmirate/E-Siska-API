import { prisma } from "../config/prisma";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
export const createBackupService = async () => {
  logger.info("Starting database backup...");
  const [
    users,
    admins,
    gurus,
    siswas,
    sekolahData,
    tahunAjarans,
    tingkatanKelas,
    ruangans,
    kelas,
    penempatanSiswas,
    mataPelajarans,
    penugasanGurus,
    skemaPenilaians,
    nilaiKomponens,
    jadwals,
    absensiSesis,
    absensiDetails,
    nilaiDetailSiswas,
    capaianKompetensis,
    rapors,
    nilaiRaporAkhirs,
    dokumens,
    pengumumans,
  ] = await prisma.$transaction([
    prisma.user.findMany(),
    prisma.admin.findMany(),
    prisma.guru.findMany(),
    prisma.siswa.findMany(),
    prisma.sekolahData.findMany(),
    prisma.tahunAjaran.findMany(),
    prisma.tingkatanKelas.findMany(),
    prisma.ruangan.findMany(),
    prisma.kelas.findMany(),
    prisma.penempatanSiswa.findMany(),
    prisma.mataPelajaran.findMany(),
    prisma.penugasanGuru.findMany(),
    prisma.skemaPenilaian.findMany(),
    prisma.nilaiKomponen.findMany(),
    prisma.jadwal.findMany(),
    prisma.absensiSesi.findMany(),
    prisma.absensiDetail.findMany(),
    prisma.nilaiDetailSiswa.findMany(),
    prisma.capaianKompetensi.findMany(),
    prisma.rapor.findMany(),
    prisma.nilaiRaporAkhir.findMany(),
    prisma.dokumen.findMany(),
    prisma.pengumuman.findMany(),
  ]);
  const backupData = {
    timestamp: new Date().toISOString(),
    version: "1.0",
    data: {
      users,
      admins,
      gurus,
      siswas,
      sekolahData,
      tahunAjarans,
      tingkatanKelas,
      ruangans,
      kelas,
      penempatanSiswas,
      mataPelajarans,
      penugasanGurus,
      skemaPenilaians,
      nilaiKomponens,
      jadwals,
      absensiSesis,
      absensiDetails,
      nilaiDetailSiswas,
      capaianKompetensis,
      rapors,
      nilaiRaporAkhirs,
      dokumens,
      pengumumans,
    },
  };
  logger.info("Database backup completed successfully.");
  return backupData;
};
export const restoreBackupService = async (backupData: any) => {
  logger.info("Starting database restore...");
  if (!backupData || !backupData.data) {
    throw new AppError("Invalid backup file format", 400);
  }
  const {
    users,
    admins,
    gurus,
    siswas,
    sekolahData,
    tahunAjarans,
    tingkatanKelas,
    ruangans,
    kelas,
    penempatanSiswas,
    mataPelajarans,
    penugasanGurus,
    skemaPenilaians,
    nilaiKomponens,
    jadwals,
    absensiSesis,
    absensiDetails,
    nilaiDetailSiswas,
    capaianKompetensis,
    rapors,
    nilaiRaporAkhirs,
    dokumens,
    pengumumans,
  } = backupData.data;
  await prisma.$transaction(async (tx) => {
    logger.info("Clearing existing data...");
    await tx.nilaiRaporAkhir.deleteMany();
    await tx.rapor.deleteMany();
    await tx.capaianKompetensi.deleteMany();
    await tx.nilaiDetailSiswa.deleteMany();
    await tx.absensiDetail.deleteMany();
    await tx.absensiSesi.deleteMany();
    await tx.jadwal.deleteMany();
    await tx.nilaiKomponen.deleteMany();
    await tx.skemaPenilaian.deleteMany();
    await tx.penugasanGuru.deleteMany();
    await tx.penempatanSiswa.deleteMany();
    await tx.kelas.deleteMany();
    await tx.mataPelajaran.deleteMany();
    await tx.ruangan.deleteMany();
    await tx.tingkatanKelas.deleteMany();
    await tx.tahunAjaran.deleteMany();
    await tx.sekolahData.deleteMany();
    await tx.dokumen.deleteMany();
    await tx.pengumuman.deleteMany();
    await tx.siswa.deleteMany();
    await tx.guru.deleteMany();
    await tx.admin.deleteMany();
    await tx.user.deleteMany();
    logger.info("Restoring data...");
    if (users?.length) await tx.user.createMany({ data: users });
    if (admins?.length) await tx.admin.createMany({ data: admins });
    if (gurus?.length) await tx.guru.createMany({ data: gurus });
    if (siswas?.length) await tx.siswa.createMany({ data: siswas });
    if (sekolahData?.length)
      await tx.sekolahData.createMany({ data: sekolahData });
    if (tahunAjarans?.length)
      await tx.tahunAjaran.createMany({ data: tahunAjarans });
    if (tingkatanKelas?.length)
      await tx.tingkatanKelas.createMany({ data: tingkatanKelas });
    if (ruangans?.length) await tx.ruangan.createMany({ data: ruangans });
    if (kelas?.length) await tx.kelas.createMany({ data: kelas });
    if (penempatanSiswas?.length)
      await tx.penempatanSiswa.createMany({ data: penempatanSiswas });
    if (mataPelajarans?.length)
      await tx.mataPelajaran.createMany({ data: mataPelajarans });
    if (penugasanGurus?.length)
      await tx.penugasanGuru.createMany({ data: penugasanGurus });
    if (skemaPenilaians?.length)
      await tx.skemaPenilaian.createMany({ data: skemaPenilaians });
    if (nilaiKomponens?.length)
      await tx.nilaiKomponen.createMany({ data: nilaiKomponens });
    if (jadwals?.length) await tx.jadwal.createMany({ data: jadwals });
    if (absensiSesis?.length)
      await tx.absensiSesi.createMany({ data: absensiSesis });
    if (absensiDetails?.length)
      await tx.absensiDetail.createMany({ data: absensiDetails });
    if (nilaiDetailSiswas?.length)
      await tx.nilaiDetailSiswa.createMany({ data: nilaiDetailSiswas });
    if (capaianKompetensis?.length)
      await tx.capaianKompetensi.createMany({ data: capaianKompetensis });
    if (rapors?.length) await tx.rapor.createMany({ data: rapors });
    if (nilaiRaporAkhirs?.length)
      await tx.nilaiRaporAkhir.createMany({ data: nilaiRaporAkhirs });
    if (dokumens?.length) await tx.dokumen.createMany({ data: dokumens });
    if (pengumumans?.length)
      await tx.pengumuman.createMany({ data: pengumumans });
  });
  logger.info("Database restore completed successfully.");
  return { message: "Database restored successfully" };
};
