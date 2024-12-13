"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { TokenAccountSignature } from "./TokenAccountSignature";

@Table({
  tableName: "TokenAccountSignatureTransaction",
  name: {
    singular: "TokenAccountSignatureTransaction",
    plural: "TokenAccountSignatureTransaction",
  },
})
export class TokenAccountSignatureTransaction extends Model {
  @BelongsTo(() => TokenAccountSignature, "tokenAccountSignatureId")
  declare signature?: NonAttribute<TokenAccountSignature>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare tokenAccountSignatureId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare programId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare mint: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare instruction: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare receiver: string;

  @Attribute(DataTypes.STRING)
  declare sender: string;

  @Attribute(DataTypes.STRING)
  declare data: string;

  @Attribute(DataTypes.STRING)
  declare escrowAccount: string;

  @Attribute(DataTypes.STRING)
  declare escrowAutority: string;

  @Attribute(DataTypes.STRING)
  declare status: string;

  @Attribute(DataTypes.DECIMAL(20, 9))
  @NotNull
  declare amount: string;

  @Attribute(DataTypes.DECIMAL(20, 9))
  @NotNull
  declare fee: string;
}
