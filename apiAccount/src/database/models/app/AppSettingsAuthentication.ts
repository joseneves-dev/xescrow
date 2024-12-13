'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'AppSettingsAuthentication',
    name: {
      singular: 'AppSettingsAuthentication',
      plural: 'AppSettingsAuthentication',
    }
})

export class AppSettingsAuthentication extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare settingsId: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare signup: boolean;
  
  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare login: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare secondFactor: boolean;
}
