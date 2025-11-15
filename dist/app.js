"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./app/routes");
const globalErrHandlers_1 = require("./app/middlewares/globalErrHandlers");
const notFound_1 = require("./app/middlewares/notFound");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "https://ride-booking-iota.vercel.app",
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend",
    });
});
app.use(globalErrHandlers_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
