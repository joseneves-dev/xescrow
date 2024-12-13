'use strict';
import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, BelongsTo } from '@sequelize/core/decorators-legacy';
import { UserAuth } from './UserAuth';

@Table({
  tableName: 'AuthTrustedDevice',
    name: {
      singular: 'AuthTrustedDevice',
      plural: 'AuthTrustedDevice',
    },
    timestamps: true
})

export class AuthTrustedDevice extends Model {
  @BelongsTo(() => UserAuth, 'authId')
  declare auth?: NonAttribute<UserAuth>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare authId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare ua: string;

  @Attribute(DataTypes.JSON)
  @NotNull
  declare browser: any;

  @Attribute(DataTypes.JSON)
  @NotNull
  declare engine: any;

  @Attribute(DataTypes.JSON)
  @NotNull
  declare os: any;

  @Attribute(DataTypes.JSON)
  @NotNull
  declare device: any;

  @Attribute(DataTypes.STRING(15))
  declare ipv4: string;

  @Attribute(DataTypes.STRING(45))
  declare ipv6: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  public readonly createdAt!: Date;

}