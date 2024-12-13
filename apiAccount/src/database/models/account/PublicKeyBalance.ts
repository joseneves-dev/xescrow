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
  tableName: "PublicKeyBalance",
  name: {
    singular: "PublicKeyBalance",
    plural: "PublicKeyBalance",
  },
})
export class PublicKeyBalance extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare publicKey: string;

  @Attribute(DataTypes.DECIMAL(20, 9))
  @Default(0.0)
  @NotNull
  declare balance: string;
}
