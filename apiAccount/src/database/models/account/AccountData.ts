"use strict";
import { randomBytes, createCipheriv } from "crypto";

import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  HasOne,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";

import { AccountDataRequest } from "./AccountDataRequest";
import { AccountDataRemove } from "./AccountDataRemove";
import { WalletAccount } from "./WalletAccount";
import { CryptoIV } from "./CryptoIV";

@Table({
  tableName: "AccountData",
  name: {
    singular: "AccountData",
    plural: "AccountData",
  },
})
export class AccountData extends Model {
  @HasOne(() => AccountDataRequest, "accountId")
  declare request?: NonAttribute<AccountDataRequest>;

  @HasOne(() => AccountDataRemove, "accountId")
  declare remove?: NonAttribute<AccountDataRemove>;

  @BelongsTo(() => WalletAccount, "accountId")
  declare account?: NonAttribute<WalletAccount>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare accountId: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare secretKey: string;

  @BeforeCreate
  @BeforeUpdate
  static async encrypt(instance: any) {
    const iv = randomBytes(16).toString("hex"); // Generate a random IV
    await CryptoIV.create({
      dataId: instance.id,
      iv: iv,
    });
    const cipher = createCipheriv(
      "aes-256-ctr",
      Buffer.from(process.env.CLIENT_TOKEN_SECRETKEY, "hex"),
      Buffer.from(iv, "hex")
    );
    let encryptedSecretKey = cipher.update(instance.secretKey, "utf-8", "hex");
    encryptedSecretKey += cipher.final("hex");

    // Save the encrypted data and IV
    instance.secretKey = encryptedSecretKey;
  }
}
