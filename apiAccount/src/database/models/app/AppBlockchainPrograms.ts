"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { AppBlockchains } from "./AppBlockchains";
@Table({
  tableName: "AppBlockchainPrograms",
  name: {
    singular: "AppBlockchainPrograms",
    plural: "AppBlockchainPrograms",
  },
})
export class AppBlockchainPrograms extends Model {
  @BelongsTo(() => AppBlockchains, "blockchainId")
  declare blockchain?: NonAttribute<AppBlockchains>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare blockchainId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare programId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare autority: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare version: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}
