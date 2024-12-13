"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  HasOne,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { AppBlockchainTokenMetaData } from "./AppBlockchainTokenMetaData";
import { AppBlockchains } from "./AppBlockchains";
@Table({
  tableName: "AppBlockchainTokens",
  name: {
    singular: "AppBlockchainTokens",
    plural: "AppBlockchainTokens",
  },
})
export class AppBlockchainTokens extends Model {
  @HasOne(() => AppBlockchainTokenMetaData, "tokenId")
  declare metaData?: NonAttribute<AppBlockchainTokenMetaData>;

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
  declare mint: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare mintAutority: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare decimals: number;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}
