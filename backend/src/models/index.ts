import { Sequelize, DataTypes } from "sequelize";
import config from "@config/index";

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 2000,
      min: 0,
      idle: 10000,
      acquire: 30000,
    },
  }
);

const db: { [key: string]: any } = {};

import { Builder } from "./Builder";
import { Project } from "./Project";

db.Builder = Builder;
db.Project = Project;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
