"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const uploader_1 = require("../middleware/uploader");
class AuthRouter {
    route;
    authController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/signin", this.authController.login);
        this.route.post("/signout", this.authController.logout);
        this.route.patch("/profile-img", (0, uploader_1.uploaderMemory)().single("img"), this.authController.changeProfileImg);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AuthRouter;
