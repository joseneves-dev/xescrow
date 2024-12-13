'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'Currencies',
    name: {
      singular: 'Currencies',
      plural: 'Currencies',
    }
})

export class Currencies extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare symbol: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}