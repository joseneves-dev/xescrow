"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  HasOne,
  HasMany,
  BeforeCreate,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";

import { AccountData } from "./AccountData";
import { TokenAccount } from "./TokenAccount";
import { AccountSignature } from "./AccountSignature";
import { PublicKeyBalance } from "./PublicKeyBalance";
import { UserWallet } from "./UserWallet";

import { AppBlockchains } from "../app/AppBlockchains";

@Table({
  tableName: "WalletAccount",
  name: {
    singular: "WalletAccount",
    plural: "WalletAccount",
  },
})
export class WalletAccount extends Model {
  @HasOne(() => AccountData, "accountId")
  declare data?: NonAttribute<AccountData>;

  @HasMany(() => TokenAccount, "accountId")
  declare tokenAccounts?: NonAttribute<TokenAccount[]>;

  @HasMany(() => AccountSignature, "accountId")
  declare signatures?: NonAttribute<AccountSignature>;

  @BelongsTo(() => AppBlockchains, "blockchainId")
  declare blockchain?: NonAttribute<AppBlockchains>;

  @BelongsTo(() => UserWallet, "walletId")
  declare wallet?: NonAttribute<UserWallet>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare walletId: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare blockchainId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare publicKey: string;

  @Attribute(DataTypes.STRING)
  declare rename: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  @BeforeCreate
  static async createPublicKeyBalance(instance: any) {
    await PublicKeyBalance.create({
      publicKey: instance.publicKey,
    });
  }
}
