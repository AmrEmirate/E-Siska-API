"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siswa_controller_1 = __importDefault(require("../controllers/siswa.controller"));
const siswa_validation_1 = require("../middleware/validation/siswa.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class SiswaRouter {
    route;
    siswaController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.siswaController = new siswa_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, siswa_validation_1.createSiswaValidation, this.siswaController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.siswaController.getAll);
        this.route.get("/:id", auth_middleware_1.authMiddleware, this.siswaController.getById);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.siswaController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.siswaController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = SiswaRouter;
