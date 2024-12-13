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
  BelongsTo,
} from "@sequelize/core/decorators-legacy";

import { AppCurrencies } from "../app/AppCurrencies";
import { WalletAccount } from "./WalletAccount";

@Table({
  tableName: "UserWallet",
  name: {
    singular: "UserWallet",
    plural: "UserWallet",
  },
})
export class UserWallet extends Model {
  @BelongsTo(() => AppCurrencies, "currencyId")
  declare currency?: NonAttribute<AppCurrencies>;

  @HasMany(() => WalletAccount, "walletId")
  declare accounts?: NonAttribute<WalletAccount[]>;

  @HasOne(() => WalletAccount, "walletId")
  declare account?: NonAttribute<WalletAccount>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare currencyId: string;

  @Attribute(DataTypes.STRING)
  declare defaultAccount: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}
