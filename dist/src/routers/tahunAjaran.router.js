"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tahunAjaran_controller_1 = __importDefault(require("../controllers/tahunAjaran.controller"));
const tahunAjaran_validation_1 = require("../middleware/validation/tahunAjaran.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class TahunAjaranRouter {
    route;
    tahunAjaranController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.tahunAjaranController = new tahunAjaran_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, tahunAjaran_validation_1.createTahunAjaranValidation, this.tahunAjaranController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.tahunAjaranController.getAll);
        this.route.get("/active", auth_middleware_1.authMiddleware, this.tahunAjaranController.getActive);
        this.route.get("/:id", auth_middleware_1.authMiddleware, this.tahunAjaranController.getById);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, tahunAjaran_validation_1.createTahunAjaranValidation, this.tahunAjaranController.update);
        this.route.post("/:id/activate", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.tahunAjaranController.activate);
        this.route.patch("/:id/active", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.tahunAjaranController.activate);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.tahunAjaranController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = TahunAjaranRouter;
