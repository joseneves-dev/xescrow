'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default } from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'SessionData',
    name: {
      singular: 'SessionData',
      plural: 'SessionData',
    }
})

export class SessionData extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare sessionId: string;

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
}