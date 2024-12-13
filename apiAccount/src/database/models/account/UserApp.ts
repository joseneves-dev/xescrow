"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  HasOne,
} from "@sequelize/core/decorators-legacy";
import { AppVerification } from "./AppVerification";
@Table({
  tableName: "UserApp",
  name: {
    singular: "UserApp",
    plural: "UserApp",
  },
})
export class UserApp extends Model {
  @HasOne(() => AppVerification, "appId")
  declare verification?: NonAttribute<AppVerification>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare verified: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}
