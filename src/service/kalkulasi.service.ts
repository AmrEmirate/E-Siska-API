import { prisma } from "../config/prisma";
import { create, all } from "mathjs";
import { upsertNilaiRepo } from "../repositories/nilai.repository";
import logger from "../utils/logger";
import { NilaiKomponenType } from "../generated/prisma";

const math = create(all);

export const calculateGradesService = async (
  mapelId: string,
  siswaIds: string[]
) => {
  logger.info(`Mulai kalkulasi nilai untuk mapel ${mapelId}`);

  const components = await prisma.nilaiKomponen.findMany({
    where: { skema: { mapelId: mapelId } },
    orderBy: { urutan: "asc" },
  });

  const readOnlyComponents = components.filter(
    (c) => c.tipe === NilaiKomponenType.READ_ONLY
  );

  if (readOnlyComponents.length === 0) return;

  const existingGrades = await prisma.nilaiDetailSiswa.findMany({
    where: {
      mapelId: mapelId,
      siswaId: { in: siswaIds },
    },
  });

  const updates: { siswaId: string; nilai: number; komponenId: string }[] = [];

  for (const siswaId of siswaIds) {
    const gradesForStudent = existingGrades.filter(
      (g) => g.siswaId === siswaId
    );

    const scope: Record<string, number> = {};

    components.forEach((comp) => {
      const grade = gradesForStudent.find((g) => g.komponenId === comp.id);
      scope[comp.namaKomponen] = grade?.nilaiAngka || 0;
    });

    for (const comp of readOnlyComponents) {
      try {
        let result: number;

        if (comp.formula) {
          // Use explicit formula if set
          result = math.evaluate(comp.formula, scope);
        } else {
          // Default: calculate average of all INPUT components with values
          const inputComponents = components.filter(
            (c) => c.tipe === NilaiKomponenType.INPUT
          );
          const values = inputComponents
            .map((c) => scope[c.namaKomponen])
            .filter((v) => v !== undefined && v !== null && v !== 0);

          if (values.length === 0) {
            continue; // Skip if no input values yet
          }

          result = values.reduce((a, b) => a + b, 0) / values.length;
        }

        scope[comp.namaKomponen] = Number(result);

        updates.push({
          siswaId,
          komponenId: comp.id,
          nilai: Number(result.toFixed(2)),
        });
      } catch (error) {
        logger.error(
          `Gagal menghitung rumus '${
            comp.formula || "rata-rata otomatis"
          }' untuk siswa ${siswaId}: ${(error as Error).message}`
        );
      }
    }
  }

  for (const comp of readOnlyComponents) {
    const updatesForComp = updates.filter((u) => u.komponenId === comp.id);
    if (updatesForComp.length > 0) {
      const sampleGrade = existingGrades.find(
        (g) => g.siswaId === updatesForComp[0].siswaId
      );
      const systemGuruId = sampleGrade?.guruId || "system-calc";

      const dataToSave = updatesForComp.map((u) => ({
        siswaId: u.siswaId,
        nilai: u.nilai,
      }));

      await upsertNilaiRepo(systemGuruId, mapelId, comp.id, dataToSave);
    }
  }

  logger.info(`Kalkulasi selesai. ${updates.length} nilai diperbarui.`);
};
