"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  BelongsTo,
  HasMany,
  HasOne,
  BeforeCreate,
} from "@sequelize/core/decorators-legacy";

import { PublicKeyBalance } from "./PublicKeyBalance";
import { TokenAccountSignature } from "./TokenAccountSignature";
import { WalletAccount } from "./WalletAccount";

import { AppBlockchainTokens } from "../app/AppBlockchainTokens";

@Table({
  tableName: "TokenAccount",
  name: {
    singular: "TokenAccount",
    plural: "TokenAccount",
  },
})
export class TokenAccount extends Model {
  @HasMany(() => TokenAccountSignature, "accountId")
  declare signatures?: NonAttribute<TokenAccountSignature>;

  @BelongsTo(() => AppBlockchainTokens, "tokenId")
  declare token?: NonAttribute<AppBlockchainTokens>;

  @BelongsTo(() => WalletAccount, "accountId")
  declare account?: NonAttribute<WalletAccount>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare tokenId: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare accountId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare publicKey: string;

  @Attribute(DataTypes.ENUM("active", "freze", "close"))
  @NotNull
  declare state: "active" | "freze" | "close";

  @BeforeCreate
  static async createPublicKeyBalance(instance: any) {
    await PublicKeyBalance.create({
      publicKey: instance.publicKey,
    });
  }
}
