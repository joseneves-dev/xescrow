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
  tableName: "AppBlockchainMetaData",
  name: {
    singular: "AppBlockchainMetaData",
    plural: "AppBlockchainMetaData",
  },
})
export class AppBlockchainMetaData extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare blockchainId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare symbol: string;
}
