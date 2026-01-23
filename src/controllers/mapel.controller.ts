import { Request, Response, NextFunction } from "express";
import {
  createMapelService,
  updateMapelService,
  deleteMapelService,
  getAllMapelService,
} from "../service/mapel.service";
import { asyncHandler } from "../utils/asyncHandler";

class MapelController {
  public create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { namaMapel, kategori } = req.body;
      const adminId = req.user?.adminId;

      if (!adminId) {
        throw new Error("Admin ID not found in request");
      }

      const result = await createMapelService({
        namaMapel,
        kategori,
        adminId,
      });

      res.status(201).send({
        success: true,
        message: "Mata pelajaran dan skema (kosong) berhasil dibuat",
        data: result,
      });
    },
  );

  public update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { namaMapel, kategori } = req.body;

      const result = await updateMapelService(id as string, {
        namaMapel,
        kategori,
      });

      res.status(200).send({
        success: true,
        message: "Mata pelajaran berhasil diperbarui",
        data: result,
      });
    },
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      await deleteMapelService(id as string);

      res.status(200).send({
        success: true,
        message: "Mata pelajaran berhasil dihapus",
      });
    },
  );

  public getAll = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const search = (req.query.search as string) || "";
      const result = await getAllMapelService(search);

      res.status(200).send({
        success: true,
        data: result,
      });
    },
  );
}

export default MapelController;
