import { prisma } from "../config/prisma";

export interface InputCapaianItem {
  siswaId: string;
  deskripsi: string;
}

/**
 * Menyimpan (Create/Update) Capaian Kompetensi
 */
export const upsertCapaianRepo = async (
  guruId: string,
  mapelId: string,
  dataCapaian: InputCapaianItem[]
) => {
  return prisma.$transaction(
    dataCapaian.map((item) =>
      prisma.capaianKompetensi.upsert({
        where: {
          siswaId_mapelId: {
            siswaId: item.siswaId,
            mapelId: mapelId,
          },
        },
        update: {
          deskripsi: item.deskripsi,
          guruId: guruId, // Update penulis terakhir
        },
        create: {
          siswaId: item.siswaId,
          mapelId: mapelId,
          guruId: guruId,
          deskripsi: item.deskripsi,
        },
      })
    )
  );
};