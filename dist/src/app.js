"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const logger_1 = __importDefault(require("./utils/logger"));
const siswa_router_1 = __importDefault(require("./routers/siswa.router"));
const guru_router_1 = __importDefault(require("./routers/guru.router"));
const tingkatan_router_1 = __importDefault(require("./routers/tingkatan.router"));
const kelas_router_1 = __importDefault(require("./routers/kelas.router"));
const ruangan_router_1 = __importDefault(require("./routers/ruangan.router"));
const mapel_router_1 = __importDefault(require("./routers/mapel.router"));
const skema_router_1 = __importDefault(require("./routers/skema.router"));
const tahunAjaran_router_1 = __importDefault(require("./routers/tahunAjaran.router"));
const penempatan_router_1 = __importDefault(require("./routers/penempatan.router"));
const penugasan_router_1 = __importDefault(require("./routers/penugasan.router"));
const jadwal_router_1 = __importDefault(require("./routers/jadwal.router"));
const pengumuman_router_1 = __importDefault(require("./routers/pengumuman.router"));
const dokumen_router_1 = __importDefault(require("./routers/dokumen.router"));
const absensi_router_1 = __importDefault(require("./routers/absensi.router"));
const nilai_router_1 = __importDefault(require("./routers/nilai.router"));
const ekskul_router_1 = __importDefault(require("./routers/ekskul.router"));
const capaian_router_1 = __importDefault(require("./routers/capaian.router"));
const rapor_router_1 = __importDefault(require("./routers/rapor.router"));
const siswa_view_router_1 = __importDefault(require("./routers/siswa-view.router"));
const wali_kelas_router_1 = __importDefault(require("./routers/wali-kelas.router"));
const guru_view_router_1 = __importDefault(require("./routers/guru-view.router"));
const sekolah_router_1 = __importDefault(require("./routers/sekolah.router"));
const backup_router_1 = __importDefault(require("./routers/backup.router"));
const PORT = process.env.PORT;
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorHandler();
    }
    configure() {
        this.app.use((0, cors_1.default)({ origin: process.env.FE_URL }));
        this.app.use(express_1.default.json());
        this.app.use((req, res, next) => {
            logger_1.default.info(`${req.method} ${req.path}`);
            next();
        });
    }
    route() {
        this.app.get("/", (req, res) => {
            res.status(200).send("<h1>Classbase API</h1>");
        });
        const apiRouter = express_1.default.Router();
        const authRouter = new auth_router_1.default();
        apiRouter.use("/auth", authRouter.getRouter());
        const siswaRouter = new siswa_router_1.default();
        apiRouter.use("/siswa", siswaRouter.getRouter());
        const guruRouter = new guru_router_1.default();
        apiRouter.use("/guru", guruRouter.getRouter());
        const tingkatanRouter = new tingkatan_router_1.default();
        apiRouter.use("/tingkatan", tingkatanRouter.getRouter());
        const kelasRouter = new kelas_router_1.default();
        apiRouter.use("/kelas", kelasRouter.getRouter());
        const ruanganRouter = new ruangan_router_1.default();
        apiRouter.use("/ruangan", ruanganRouter.getRouter());
        const mapelRouter = new mapel_router_1.default();
        apiRouter.use("/mapel", mapelRouter.getRouter());
        const skemaRouter = new skema_router_1.default();
        apiRouter.use("/skema", skemaRouter.getRouter());
        const tahunAjaranRouter = new tahunAjaran_router_1.default();
        apiRouter.use("/tahun-ajaran", tahunAjaranRouter.getRouter());
        const penempatanRouter = new penempatan_router_1.default();
        apiRouter.use("/penempatan", penempatanRouter.getRouter());
        const penugasanRouter = new penugasan_router_1.default();
        apiRouter.use("/penugasan-guru", penugasanRouter.getRouter());
        const jadwalRouter = new jadwal_router_1.default();
        apiRouter.use("/jadwal", jadwalRouter.getRouter());
        const pengumumanRouter = new pengumuman_router_1.default();
        apiRouter.use("/pengumuman", pengumumanRouter.getRouter());
        const dokumenRouter = new dokumen_router_1.default();
        apiRouter.use("/dokumen", dokumenRouter.getRouter());
        const absensiRouter = new absensi_router_1.default();
        apiRouter.use("/absensi", absensiRouter.getRouter());
        const nilaiRouter = new nilai_router_1.default();
        apiRouter.use("/nilai", nilaiRouter.getRouter());
        const ekskulRouter = new ekskul_router_1.default();
        apiRouter.use("/nilai-ekskul", ekskulRouter.getRouter());
        const capaianRouter = new capaian_router_1.default();
        apiRouter.use("/capaian", capaianRouter.getRouter());
        const raporRouter = new rapor_router_1.default();
        apiRouter.use("/rapor", raporRouter.getRouter());
        const siswaViewRouter = new siswa_view_router_1.default();
        apiRouter.use("/siswa-view", siswaViewRouter.getRouter());
        const waliKelasRouter = new wali_kelas_router_1.default();
        apiRouter.use("/wali-kelas", waliKelasRouter.getRouter());
        const guruViewRouter = new guru_view_router_1.default();
        apiRouter.use("/guru-view", guruViewRouter.getRouter());
        const sekolahRouter = new sekolah_router_1.default();
        apiRouter.use("/sekolah", sekolahRouter.getRouter());
        const backupRouter = new backup_router_1.default();
        apiRouter.use("/backup", backupRouter.getRouter());
        this.app.use("/api", apiRouter);
    }
    errorHandler() {
        this.app.use((error, req, res, next) => {
            logger_1.default.error(`${req.method} ${req.path}: ${error.message} ${JSON.stringify(error)}`);
            let status = 500;
            if (typeof error.code === "number") {
                status = error.code;
            }
            else if (error.code === "P2002") {
                status = 409;
            }
            else if (error.code === "P2003") {
                status = 400;
            }
            else if (error.code === "P2025") {
                status = 404;
            }
            res.status(status).send(error);
        });
    }
    start() {
        this.app.listen(PORT, () => {
            logger_1.default.info(`API Running: http://localhost:${PORT}`);
        });
    }
}
exports.default = App;
