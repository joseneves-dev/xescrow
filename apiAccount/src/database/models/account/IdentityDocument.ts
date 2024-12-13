'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default } from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'IdentityDocument',
    name: {
      singular: 'IdentityDocument',
      plural: 'IdentityDocument',
    }
})

export class IdentityDocument extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare identityId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare fileName: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare originalName: string;

  @Attribute(DataTypes.BIGINT)
  @NotNull
  declare size: bigint;
}