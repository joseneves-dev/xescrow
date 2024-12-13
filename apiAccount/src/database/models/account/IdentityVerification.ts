'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default } from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'IdentityVerification',
    name: {
      singular: 'IdentityVerification',
      plural: 'IdentityVerification',
    }
})

export class IdentityVerification extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare identityId: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare upload: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare review: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}