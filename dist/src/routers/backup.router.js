"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const backup_controller_1 = __importDefault(require("../controllers/backup.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class BackupRouter {
    route;
    backupController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.backupController = new backup_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/create", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.backupController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.backupController.list);
        this.route.post("/restore", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.backupController.restore);
        this.route.delete("/:filename", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.backupController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = BackupRouter;
