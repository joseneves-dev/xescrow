'use strict';
import { DateTime } from 'luxon';

import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, BeforeCreate} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'OneTimeNotification',
    name: {
      singular: 'OneTimeNotification',
      plural: 'OneTimeNotification',
    }
})

export class OneTimeNotification extends Model {

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare dataId: string;
  
  @Attribute(DataTypes.DATE)
  declare nextRequest: Date;

  @Attribute(DataTypes.DATE)
  declare expires: Date;
  
  @Attribute(DataTypes.BOOLEAN) 
  declare success: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  @BeforeCreate
  static async expire(instance: any) { 
    instance.expires = DateTime.fromJSDate(instance.createdAt).plus({ minutes: 10 }).toJSDate();
    instance.nextRequest = DateTime.fromJSDate(instance.createdAt).plus({ seconds: 10}).toJSDate();
  }
}