import { prisma } from "../config/prisma";

export interface InputEkskulItem {
  siswaId: string;
  deskripsi: string;
}

/**
 * Menyimpan (Create/Update) nilai deskripsi untuk Ekstrakurikuler
 */
export const saveNilaiEkskulRepo = async (
  guruId: string,
  mapelId: string,
  dataNilai: InputEkskulItem[]
) => {
  return prisma.$transaction(async (tx) => {
    const results = [];
    for (const item of dataNilai) {
      // 1. Cari nilai ekskul yang sudah ada (komponenId = null)
      const existing = await tx.nilaiDetailSiswa.findFirst({
        where: {
          siswaId: item.siswaId,
          mapelId: mapelId,
          komponenId: null, // Menandakan ini nilai level mapel (Ekskul)
        },
      });

      if (existing) {
        // 2. Update
        const updated = await tx.nilaiDetailSiswa.update({
          where: { id: existing.id },
          data: {
            nilaiDeskripsi: item.deskripsi,
            guruId: guruId,
          },
        });
        results.push(updated);
      } else {
        // 3. Create
        const created = await tx.nilaiDetailSiswa.create({
          data: {
            siswaId: item.siswaId,
            mapelId: mapelId,
            komponenId: null,
            guruId: guruId,
            nilaiDeskripsi: item.deskripsi,
            // nilaiAngka dibiarkan null
          },
        });
        results.push(created);
      }
    }
    return results;
  });
};