"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guru_view_controller_1 = __importDefault(require("../controllers/guru-view.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class GuruViewRouter {
    route;
    guruViewController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.guruViewController = new guru_view_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.get("/my-jadwal", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.guruViewController.getMyJadwal);
        this.route.get("/pengumuman", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.guruViewController.getPengumuman);
        this.route.get("/dokumen", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.guruViewController.getDokumen);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = GuruViewRouter;
