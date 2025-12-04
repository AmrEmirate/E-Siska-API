import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import logger from "./utils/logger";
import SiswaRouter from "./routers/siswa.router";
import GuruRouter from "./routers/guru.router";
import TingkatanRouter from "./routers/tingkatan.router";
import KelasRouter from "./routers/kelas.router";
import RuanganRouter from "./routers/ruangan.router";
import MapelRouter from "./routers/mapel.router";
import SkemaRouter from "./routers/skema.router";
import TahunAjaranRouter from "./routers/tahunAjaran.router";
import PenempatanRouter from "./routers/penempatan.router";
import PenugasanRouter from "./routers/penugasan.router";
import JadwalRouter from "./routers/jadwal.router";
import PengumumanRouter from "./routers/pengumuman.router";
import DokumenRouter from "./routers/dokumen.router";
import AbsensiRouter from "./routers/absensi.router";
import NilaiRouter from "./routers/nilai.router";
import EkskulRouter from "./routers/ekskul.router";
import CapaianRouter from "./routers/capaian.router";
import RaporRouter from "./routers/rapor.router";
import SiswaViewRouter from "./routers/siswa-view.router";
import WaliKelasRouter from "./routers/wali-kelas.router";
import GuruViewRouter from "./routers/guru-view.router";
import SekolahRouter from "./routers/sekolah.router";
import BackupRouter from "./routers/backup.router";
const PORT: string = process.env.PORT as string;
class App {
  public app: Application;
  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler();
  }
  private configure(): void {
    this.app.use(cors({ origin: process.env.FE_URL }));
    this.app.use(express.json());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }
  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Classbase API</h1>");
    });
    const apiRouter = express.Router();
    const authRouter: AuthRouter = new AuthRouter();
    apiRouter.use("/auth", authRouter.getRouter());
    const siswaRouter: SiswaRouter = new SiswaRouter();
    apiRouter.use("/siswa", siswaRouter.getRouter());
    const guruRouter: GuruRouter = new GuruRouter();
    apiRouter.use("/guru", guruRouter.getRouter());
    const tingkatanRouter: TingkatanRouter = new TingkatanRouter();
    apiRouter.use("/tingkatan", tingkatanRouter.getRouter());
    const kelasRouter: KelasRouter = new KelasRouter();
    apiRouter.use("/kelas", kelasRouter.getRouter());
    const ruanganRouter: RuanganRouter = new RuanganRouter();
    apiRouter.use("/ruangan", ruanganRouter.getRouter());
    const mapelRouter: MapelRouter = new MapelRouter();
    apiRouter.use("/mapel", mapelRouter.getRouter());
    const skemaRouter: SkemaRouter = new SkemaRouter();
    apiRouter.use("/skema", skemaRouter.getRouter());
    const tahunAjaranRouter: TahunAjaranRouter = new TahunAjaranRouter();
    apiRouter.use("/tahun-ajaran", tahunAjaranRouter.getRouter());
    const penempatanRouter: PenempatanRouter = new PenempatanRouter();
    apiRouter.use("/penempatan", penempatanRouter.getRouter());
    const penugasanRouter: PenugasanRouter = new PenugasanRouter();
    apiRouter.use("/penugasan-guru", penugasanRouter.getRouter());
    const jadwalRouter: JadwalRouter = new JadwalRouter();
    apiRouter.use("/jadwal", jadwalRouter.getRouter());
    const pengumumanRouter: PengumumanRouter = new PengumumanRouter();
    apiRouter.use("/pengumuman", pengumumanRouter.getRouter());
    const dokumenRouter: DokumenRouter = new DokumenRouter();
    apiRouter.use("/dokumen", dokumenRouter.getRouter());
    const absensiRouter: AbsensiRouter = new AbsensiRouter();
    apiRouter.use("/absensi", absensiRouter.getRouter());
    const nilaiRouter: NilaiRouter = new NilaiRouter();
    apiRouter.use("/nilai", nilaiRouter.getRouter());
    const ekskulRouter: EkskulRouter = new EkskulRouter();
    apiRouter.use("/nilai-ekskul", ekskulRouter.getRouter());
    const capaianRouter: CapaianRouter = new CapaianRouter();
    apiRouter.use("/capaian", capaianRouter.getRouter());
    const raporRouter: RaporRouter = new RaporRouter();
    apiRouter.use("/rapor", raporRouter.getRouter());
    const siswaViewRouter: SiswaViewRouter = new SiswaViewRouter();
    apiRouter.use("/siswa-view", siswaViewRouter.getRouter());
    const waliKelasRouter: WaliKelasRouter = new WaliKelasRouter();
    apiRouter.use("/wali-kelas", waliKelasRouter.getRouter());
    const guruViewRouter: GuruViewRouter = new GuruViewRouter();
    apiRouter.use("/guru-view", guruViewRouter.getRouter());
    const sekolahRouter: SekolahRouter = new SekolahRouter();
    apiRouter.use("/sekolah", sekolahRouter.getRouter());
    const backupRouter: BackupRouter = new BackupRouter();
    apiRouter.use("/backup", backupRouter.getRouter());
    this.app.use("/api", apiRouter);
  }
  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        logger.error(
          `${req.method} ${req.path}: ${error.message} ${JSON.stringify(error)}`
        );
        let status = 500;
        if (typeof error.code === "number") {
          status = error.code;
        } else if (error.code === "P2002") {
          status = 409;
        } else if (error.code === "P2003") {
          status = 400;
        } else if (error.code === "P2025") {
          status = 404;
        }
        res.status(status).send(error);
      }
    );
  }
  public start(): void {
    this.app.listen(PORT, () => {
      logger.info(`API Running: http://localhost:${PORT}`);
    });
  }
}
export default App;
