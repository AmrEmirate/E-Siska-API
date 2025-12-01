/*
  Warnings:

  - You are about to drop the column `nis` on the `Siswa` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `AbsensiDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AbsensiSesi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CapaianKompetensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Dokumen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Jadwal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MataPelajaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NilaiDetailSiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NilaiKomponen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NilaiRaporAkhir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PenempatanSiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pengumuman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PenugasanGuru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Rapor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ruangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SekolahData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Made the column `nisn` on table `Siswa` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `SkemaPenilaian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TahunAjaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TingkatanKelas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Siswa_nis_key";

-- AlterTable
ALTER TABLE "AbsensiDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AbsensiSesi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CapaianKompetensi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Dokumen" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Guru" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Jadwal" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Kelas" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MataPelajaran" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NilaiDetailSiswa" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NilaiKomponen" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NilaiRaporAkhir" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PenempatanSiswa" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Pengumuman" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PenugasanGuru" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Rapor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ruangan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SekolahData" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Siswa" DROP COLUMN "nis",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nisn" SET NOT NULL;

-- AlterTable
ALTER TABLE "SkemaPenilaian" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TahunAjaran" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TingkatanKelas" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);
