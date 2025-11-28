"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mapel_controller_1 = __importDefault(require("../controllers/mapel.controller"));
const mapel_validation_1 = require("../middleware/validation/mapel.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class MapelRouter {
    route;
    mapelController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.mapelController = new mapel_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, mapel_validation_1.createMapelValidation, this.mapelController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.mapelController.getAll);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.mapelController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.mapelController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = MapelRouter;
