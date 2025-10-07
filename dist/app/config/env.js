"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.envVars = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
};
// import dotenv from "dotenv";
// dotenv.config();
// interface EnvConfig {
//   PORT: string;
//   DB_URL: string;
//   NODE_ENV: "development" | "production";
//   BCRYPT_SALT_ROUND: string;
//   JWT_ACCESS_EXPIRES: string;
//   JWT_ACCESS_SECRET: string;
// }
// const loadEnvVariables = (): EnvConfig => {
//   const requiredEnvVariables: string[] = [
//     "PORT",
//     "DB_URL",
//     "NODE_ENV",
//     "BCRYPT_SALT_ROUND",
//     "JWT_ACCESS_EXPIRES",
//     "JWT_ACCESS_SECRET"
//   ];
//   requiredEnvVariables.forEach((key) => {
//     if (!process.env[key]) {
//       throw new Error(`Missing require environment variable ${key}`);
//     }
//   });
//   return {
//    PORT: process.env.PORT as string,
//   DB_URL: process.env.DB_URL as string,
//   NODE_ENV: process.env.NODE_ENV as "development" | "production",
//   BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
//   JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string ,
//   JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
//   };
// };
// export const envVars = loadEnvVariables();
