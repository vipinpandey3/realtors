require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "vipinpandey",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "realtors",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: `${process.env.DB_NAME || "realtors"}_test`,
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
