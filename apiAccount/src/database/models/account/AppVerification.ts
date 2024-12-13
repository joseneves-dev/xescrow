'use strict';

import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'AppVerification',
    name: {
      singular: 'AppVerification',
      plural: 'AppVerification',
    }
})

export class AppVerification extends Model {

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare appId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare token: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}