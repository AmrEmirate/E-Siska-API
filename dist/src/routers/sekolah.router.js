"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sekolah_controller_1 = __importDefault(require("../controllers/sekolah.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class SekolahRouter {
    route;
    sekolahController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.sekolahController = new sekolah_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.sekolahController.get);
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.sekolahController.upsert);
        this.route.put("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.sekolahController.upsert);
        this.route.delete("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.sekolahController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = SekolahRouter;
