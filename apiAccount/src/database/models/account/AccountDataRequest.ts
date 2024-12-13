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
  tableName: "AccountDataRequest",
  name: {
    singular: "AccountDataRequest",
    plural: "AccountDataRequest",
  },
})
export class AccountDataRequest extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare accountId: string;

  @Attribute(DataTypes.ENUM("emailAddress", "phoneNumber", "app"))
  @NotNull
  declare method: "emailAddress" | "phoneNumber" | "app";

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}
