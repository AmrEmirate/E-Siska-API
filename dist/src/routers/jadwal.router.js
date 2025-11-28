"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jadwal_controller_1 = __importDefault(require("../controllers/jadwal.controller"));
const jadwal_validation_1 = require("../middleware/validation/jadwal.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class JadwalRouter {
    route;
    jadwalController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.jadwalController = new jadwal_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, jadwal_validation_1.createJadwalValidation, this.jadwalController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.jadwalController.getAll);
        this.route.get("/:id", auth_middleware_1.authMiddleware, this.jadwalController.getById);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, jadwal_validation_1.createJadwalValidation, this.jadwalController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.jadwalController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = JadwalRouter;
