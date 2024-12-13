"use strict";
import { DataTypes, Model, sql } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
} from "@sequelize/core/decorators-legacy";

@Table({
  tableName: "ResidenceVerification",
  name: {
    singular: "ResidenceVerification",
    plural: "ResidenceVerification",
  },
})
export class ResidenceVerification extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare addressId: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare upload: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare review: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare verified: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare active: boolean;
}
