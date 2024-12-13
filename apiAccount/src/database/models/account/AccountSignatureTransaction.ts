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
  tableName: "AccountSignatureTransaction",
  name: {
    singular: "AccountSignatureTransaction",
    plural: "AccountSignatureTransaction",
  },
})
export class AccountSignatureTransaction extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare accountSignatureId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare programId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare instruction: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare receiver: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare sender: string;

  @Attribute(DataTypes.STRING)
  declare status: string;

  @Attribute(DataTypes.DECIMAL(20, 9))
  @NotNull
  declare amount: string;

  @Attribute(DataTypes.DECIMAL(20, 9))
  @NotNull
  declare fee: string;
}
