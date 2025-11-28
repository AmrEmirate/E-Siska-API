"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skema_controller_1 = __importDefault(require("../controllers/skema.controller"));
const skema_validation_1 = require("../middleware/validation/skema.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class SkemaRouter {
    route;
    skemaController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.skemaController = new skema_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/:skemaId/komponen", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, skema_validation_1.addKomponenValidation, this.skemaController.addKomponen);
        this.route.get("/mapel/:mapelId", auth_middleware_1.authMiddleware, this.skemaController.getSkema);
        this.route.delete("/komponen/:komponenId", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.skemaController.deleteKomponen);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = SkemaRouter;
