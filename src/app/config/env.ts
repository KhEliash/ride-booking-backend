import dotenv from "dotenv";

dotenv.config();

// interface EnvConfig  {
//     PORT : string | undefined;
//     DB_URL : string | undefined;
//     NODE_ENV : "development" | "production";
// }

export const envVars = {
  PORT: process.env.PORT as string,
  DB_URL: process.env.DB_URL as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
};
