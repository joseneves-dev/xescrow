'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'Timezones',
    name: {
      singular: 'Timezones',
      plural: 'Timezones',
    }
})

export class Timezones extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare abbreviation: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare offset: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}