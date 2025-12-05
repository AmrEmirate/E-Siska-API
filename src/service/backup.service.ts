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
  
  const data = backupData.data;
  
  // Create a fresh Prisma client for restore operation
  const { PrismaClient } = require("../generated/prisma");
  const freshPrisma = new PrismaClient();
  
  try {
    logger.info("Clearing existing data (using raw SQL)...");
    
    // Use raw SQL CASCADE to delete all data
    await freshPrisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "NilaiRaporAkhir", "Rapor", "CapaianKompetensi", "NilaiDetailSiswa",
        "AbsensiDetail", "AbsensiSesi", "Jadwal", "NilaiKomponen", "SkemaPenilaian",
        "PenugasanGuru", "PenempatanSiswa", "Kelas", "MataPelajaran", "Ruangan",
        "TingkatanKelas", "TahunAjaran", "SekolahData", "Dokumen", "Pengumuman",
        "Siswa", "Guru", "Admin", "User"
      CASCADE
    `);
    
    logger.info("All data cleared. Now restoring...");

    // Helper function to restore table one by one
    const restoreTable = async (name: string, items: any[], model: any) => {
      if (items?.length) {
        logger.info(`Restoring ${items.length} ${name}...`);
        for (const item of items) {
          try {
            await model.create({ data: item });
          } catch (e: any) {
            if (e.code !== 'P2002') { // Skip only duplicate errors
              logger.warn(`Error restoring ${name}: ${e.message}`);
            }
          }
        }
      }
    };

    // Restore in correct order (parent tables first)
    await restoreTable('users', data.users, freshPrisma.user);
    await restoreTable('admins', data.admins, freshPrisma.admin);
    await restoreTable('gurus', data.gurus, freshPrisma.guru);
    await restoreTable('siswas', data.siswas, freshPrisma.siswa);
    await restoreTable('sekolahData', data.sekolahData, freshPrisma.sekolahData);
    await restoreTable('tahunAjarans', data.tahunAjarans, freshPrisma.tahunAjaran);
    await restoreTable('tingkatanKelas', data.tingkatanKelas, freshPrisma.tingkatanKelas);
    await restoreTable('ruangans', data.ruangans, freshPrisma.ruangan);
    await restoreTable('kelas', data.kelas, freshPrisma.kelas);
    await restoreTable('penempatanSiswas', data.penempatanSiswas, freshPrisma.penempatanSiswa);
    await restoreTable('mataPelajarans', data.mataPelajarans, freshPrisma.mataPelajaran);
    await restoreTable('penugasanGurus', data.penugasanGurus, freshPrisma.penugasanGuru);
    await restoreTable('skemaPenilaians', data.skemaPenilaians, freshPrisma.skemaPenilaian);
    await restoreTable('nilaiKomponens', data.nilaiKomponens, freshPrisma.nilaiKomponen);
    await restoreTable('jadwals', data.jadwals, freshPrisma.jadwal);
    await restoreTable('absensiSesis', data.absensiSesis, freshPrisma.absensiSesi);
    await restoreTable('absensiDetails', data.absensiDetails, freshPrisma.absensiDetail);
    await restoreTable('nilaiDetailSiswas', data.nilaiDetailSiswas, freshPrisma.nilaiDetailSiswa);
    await restoreTable('capaianKompetensis', data.capaianKompetensis, freshPrisma.capaianKompetensi);
    await restoreTable('rapors', data.rapors, freshPrisma.rapor);
    await restoreTable('nilaiRaporAkhirs', data.nilaiRaporAkhirs, freshPrisma.nilaiRaporAkhir);
    await restoreTable('dokumens', data.dokumens, freshPrisma.dokumen);
    await restoreTable('pengumumans', data.pengumumans, freshPrisma.pengumuman);
    
    logger.info("Database restore completed successfully.");
    return { message: "Database restored successfully" };
  } catch (error: any) {
    logger.error(`Restore failed: ${error.message}`);
    throw new AppError(`Gagal restore database: ${error.message}`, 500);
  } finally {
    await freshPrisma.$disconnect();
  }
};
