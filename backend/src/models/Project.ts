import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import { Builder } from "./Builder";

export interface ProjectAttrs {
  id: number;
  builder_id: number;
  name: string;
  location: string;
  price_range?: string | null;
  price_min_inr?: bigint | number | null;
  price_max_inr?: bigint | number | null;
  status?: "Ongoing" | "Ready to Move" | "Completed" | "Paused";
}

export type ProjectCreation = Optional<ProjectAttrs, "id">;

export class Project
  extends Model<ProjectAttrs, ProjectCreation>
  implements ProjectAttrs
{
  public id!: number;
  public builder_id!: number;
  public name!: string;
  public location!: string;
  public price_range!: string | null;
  public price_min_inr!: number | null;
  public price_max_inr!: number | null;
  public status!: "Ongoing" | "Ready to Move" | "Completed" | "Paused";
}

Project.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    builder_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.TEXT, allowNull: false },
    price_range: { type: DataTypes.TEXT, allowNull: true },
    price_min_inr: { type: DataTypes.BIGINT, allowNull: true },
    price_max_inr: { type: DataTypes.BIGINT, allowNull: true },
    status: {
      type: DataTypes.ENUM("Ongoing", "Ready to Move", "Completed", "Paused"),
      defaultValue: "Ongoing",
      allowNull: false,
    },
  },
  { sequelize, tableName: "projects", timestamps: false }
);

Builder.hasMany(Project, { foreignKey: "builder_id" });
Project.belongsTo(Builder, { foreignKey: "builder_id" });
