"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pengumuman_controller_1 = __importDefault(require("../controllers/pengumuman.controller"));
const pengumuman_validation_1 = require("../middleware/validation/pengumuman.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class PengumumanRouter {
    route;
    pengumumanController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.pengumumanController = new pengumuman_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, pengumuman_validation_1.createPengumumanValidation, this.pengumumanController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.pengumumanController.getAll);
        this.route.get("/:id", auth_middleware_1.authMiddleware, this.pengumumanController.getById);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, pengumuman_validation_1.createPengumumanValidation, this.pengumumanController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.pengumumanController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = PengumumanRouter;
