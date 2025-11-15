"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = void 0;
const setCookie = (res, tokenInfo) => {
    if (tokenInfo) {
        res.cookie("accessToken", tokenInfo, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
};
exports.setCookie = setCookie;
