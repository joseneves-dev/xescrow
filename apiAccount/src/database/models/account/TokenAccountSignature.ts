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
import { TokenAccountSignatureTransaction } from "./TokenAccountSignatureTransaction";

@Table({
  tableName: "TokenAccountSignature",
  name: {
    singular: "TokenAccountSignature",
    plural: "TokenAccountSignature",
  },
})
export class TokenAccountSignature extends Model {
  @HasOne(() => TokenAccountSignatureTransaction, "tokenAccountSignatureId")
  declare transaction?: NonAttribute<TokenAccountSignatureTransaction>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare tokenAccountId: string;

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
