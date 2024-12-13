'use strict';
import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, HasOne, BelongsTo} from '@sequelize/core/decorators-legacy';

import { AppLanguages } from '../app/AppLanguages';
import { AppTimezones } from '../app/AppTimezones';

@Table({
  tableName: 'UserSettings',
    name: {
      singular: 'UserSettings',
      plural: 'UserSettings',
    }
  })

export class UserSettings extends Model {

  @BelongsTo(() => AppLanguages, 'languageId')
  declare language?: NonAttribute<AppLanguages>

  @BelongsTo(() => AppTimezones, 'timezoneId')
  declare timezone?: NonAttribute<AppTimezones>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.UUID)
  @Default('a19f1e67-0b2e-4f53-9c09-81f4831b42c6')
  declare timezoneId: string;

  @Attribute(DataTypes.UUID)
  @Default('a19f1e67-0b2e-4f53-9c09-81f4831b42c6')
  declare languageId: string;

  @Attribute(DataTypes.ENUM('light','dark'))
  @Default('light')
  declare colorSchema: 'light' | 'dark';

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}