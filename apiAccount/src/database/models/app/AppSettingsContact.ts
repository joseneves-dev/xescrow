'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'AppSettingsContact',
    name: {
      singular: 'AppSettingsContact',
      plural: 'AppSettingsContact',
    }
})

export class AppSettingsContact extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare settingsId: string;
  
  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare emailAddress: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare phoneNumber: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare app: boolean;
}
