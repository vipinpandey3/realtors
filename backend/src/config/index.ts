import dotenv from "dotenv";
dotenv.config();

interface Config {
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    url?: string;
  };
  ENVIRONMENT: string;
  UAT: string;

  SESSION_SECRET_KEY: string;

  SERVER_PORT: string;
  SERVER_PROTOCOL: string;
  SERVER_HOST: string;
  SERVER_HOST_CLIENT: string;

  JWT_SIGNING_KEY: string;
  bodyParserLimit: string;

  UPLOAD_FOLDER_PATH: string;

  IS_PRODUCTION_ENVIRONMENT: () => boolean;
  logLevel: string;
}

const config: Config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_SCHEMA || "creators_api_db",
    user: process.env.DB_USER_NAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    url: process.env.DATABASE_URL,
  },
  ENVIRONMENT: process.env.ENVIRONMENT || "",
  UAT: "UAT",

  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY || "",

  SERVER_PORT: process.env.SERVER_PORT || "",
  SERVER_PROTOCOL: process.env.SERVER_PROTOCOL || "",
  SERVER_HOST: process.env.SERVER_HOST || "",
  SERVER_HOST_CLIENT: process.env.SERVER_HOST_CLIENT || "",

  JWT_SIGNING_KEY: process.env.JWT_SIGNING_KEY || "",
  bodyParserLimit: "10mb",

  UPLOAD_FOLDER_PATH: process.env.UPLOAD_FOLDER_PATH || "",

  IS_PRODUCTION_ENVIRONMENT: () => process.env.ENVIRONMENT === "PRODUCTION",
  logLevel: process.env.LOG_LEVEL || "info",
};

export default config;
