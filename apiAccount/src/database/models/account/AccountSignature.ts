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
import { AccountSignatureTransaction } from "./AccountSignatureTransaction";

@Table({
  tableName: "AccountSignature",
  name: {
    singular: "AccountSignature",
    plural: "AccountSignature",
  },
})
export class AccountSignature extends Model {
  @HasOne(() => AccountSignatureTransaction, "accountSignatureId")
  declare transaction?: NonAttribute<AccountSignatureTransaction>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare accountId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare signature: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare blockTime: number;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare confirmationStatus: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare err: boolean;

  @Attribute(DataTypes.STRING)
  declare memo: string;

  @Attribute(DataTypes.BIGINT)
  @NotNull
  declare slot: number;
}
