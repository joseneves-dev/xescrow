"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  HasMany,
  HasOne,
} from "@sequelize/core/decorators-legacy";
import { AppBlockchainMetaData } from "./AppBlockchainMetaData";
import { AppBlockchainTokens } from "./AppBlockchainTokens";

@Table({
  tableName: "AppBlockchains",
  name: {
    singular: "AppBlockchains",
    plural: "AppBlockchains",
  },
})
export class AppBlockchains extends Model {
  @HasOne(() => AppBlockchainMetaData, "blockchainId")
  declare metaData?: NonAttribute<AppBlockchainMetaData>;

  @HasMany(() => AppBlockchainTokens, "blockchainId")
  declare tokens?: NonAttribute<AppBlockchainTokens[]>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare programId: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare decimals: number;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}
