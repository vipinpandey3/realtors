import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

export interface BuilderAttrs {
  id: number;
  name: string;
  hq_location?: string | null;
  established_year?: number | null;
}

export type BuilderCreation = Optional<BuilderAttrs, "id">;

export class Builder
  extends Model<BuilderAttrs, BuilderCreation>
  implements BuilderAttrs
{
  public id!: number;
  public name!: string;
  public hq_location!: string | null;
  public established_year!: number | null;
}

Builder.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false, unique: true },
    hq_location: { type: DataTypes.TEXT, allowNull: true },
    established_year: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "builders", timestamps: false }
);
