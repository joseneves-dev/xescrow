'use strict';
import { DataTypes, Model, sql, NonAttribute } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default, HasOne} from '@sequelize/core/decorators-legacy';
import { AppSettingsAuthentication } from './AppSettingsAuthentication';
import { AppSettingsContact } from './AppSettingsContact';

@Table({
  tableName: 'AppSettings',
    name: {
      singular: 'AppSettings',
      plural: 'AppSettings',
    }
})

export class AppSettings extends Model {

  @HasOne(() => AppSettingsContact, 'settingsId')
  declare contact?: NonAttribute<AppSettingsContact>

  @HasOne(() => AppSettingsAuthentication, 'settingsId')
  declare authentication?: NonAttribute<AppSettingsAuthentication>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;
}
