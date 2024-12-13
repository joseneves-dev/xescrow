'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default } from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'CryptoIV',
    name: {
      singular: 'CryptoIV',
      plural: 'CryptoIV',
    }
})

export class CryptoIV extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare dataId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare iv: string;
}