"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dokumen_controller_1 = __importDefault(require("../controllers/dokumen.controller"));
const dokumen_validation_1 = require("../middleware/validation/dokumen.validation");
const uploader_1 = require("../middleware/uploader");
const auth_middleware_1 = require("../middleware/auth.middleware");
class DokumenRouter {
    route;
    dokumenController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.dokumenController = new dokumen_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, (0, uploader_1.uploaderMemory)().single("file"), dokumen_validation_1.createDokumenValidation, this.dokumenController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.dokumenController.getAll);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.dokumenController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = DokumenRouter;
