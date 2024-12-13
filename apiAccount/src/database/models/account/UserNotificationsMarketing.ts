'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default } from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'UserNotificationsMarketing',
    name: {
      singular: 'UserNotificationsMarketing',
      plural: 'UserNotificationsMarketing',
    }
})

export class UserNotificationsMarketing extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare email: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare phone: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare app: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare partners: boolean;
}