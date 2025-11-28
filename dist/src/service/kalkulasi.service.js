"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGradesService = void 0;
const prisma_1 = require("../config/prisma");
const mathjs_1 = require("mathjs");
const nilai_repository_1 = require("../repositories/nilai.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const prisma_2 = require("../generated/prisma");
const math = (0, mathjs_1.create)(mathjs_1.all);
const calculateGradesService = async (mapelId, siswaIds) => {
    logger_1.default.info(`Mulai kalkulasi nilai untuk mapel ${mapelId}`);
    const components = await prisma_1.prisma.nilaiKomponen.findMany({
        where: { skema: { mapelId: mapelId } },
        orderBy: { urutan: "asc" },
    });
    const readOnlyComponents = components.filter((c) => c.tipe === prisma_2.NilaiKomponenType.READ_ONLY);
    if (readOnlyComponents.length === 0)
        return;
    const existingGrades = await prisma_1.prisma.nilaiDetailSiswa.findMany({
        where: {
            mapelId: mapelId,
            siswaId: { in: siswaIds },
        },
    });
    const updates = [];
    for (const siswaId of siswaIds) {
        const gradesForStudent = existingGrades.filter((g) => g.siswaId === siswaId);
        const scope = {};
        components.forEach((comp) => {
            const grade = gradesForStudent.find((g) => g.komponenId === comp.id);
            scope[comp.namaKomponen] = grade?.nilaiAngka || 0;
        });
        for (const comp of readOnlyComponents) {
            if (!comp.formula)
                continue;
            try {
                const result = math.evaluate(comp.formula, scope);
                scope[comp.namaKomponen] = Number(result);
                updates.push({
                    siswaId,
                    komponenId: comp.id,
                    nilai: Number(result.toFixed(2)),
                });
            }
            catch (error) {
                logger_1.default.error(`Gagal menghitung rumus '${comp.formula}' untuk siswa ${siswaId}: ${error.message}`);
            }
        }
    }
    for (const comp of readOnlyComponents) {
        const updatesForComp = updates.filter((u) => u.komponenId === comp.id);
        if (updatesForComp.length > 0) {
            const sampleGrade = existingGrades.find((g) => g.siswaId === updatesForComp[0].siswaId);
            const systemGuruId = sampleGrade?.guruId || "system-calc";
            const dataToSave = updatesForComp.map((u) => ({
                siswaId: u.siswaId,
                nilai: u.nilai,
            }));
            await (0, nilai_repository_1.upsertNilaiRepo)(systemGuruId, mapelId, comp.id, dataToSave);
        }
    }
    logger_1.default.info(`Kalkulasi selesai. ${updates.length} nilai diperbarui.`);
};
exports.calculateGradesService = calculateGradesService;
