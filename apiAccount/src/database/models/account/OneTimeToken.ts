'use strict';
import bcryptjs from 'bcryptjs';
import { DateTime } from 'luxon';

import { DataTypes, Model, sql, Op } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, BeforeCreate, BeforeUpdate} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'OneTimeToken',
    name: {
      singular: 'OneTimeToken',
      plural: 'OneTimeToken',
    }
})

export class OneTimeToken extends Model {

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare dataId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare token: string;

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
    instance.nextRequest = DateTime.fromJSDate(instance.createdAt).plus({ seconds: 30}).toJSDate();
  }
  
  @BeforeCreate
  static async deactivate(instance: any){
    await OneTimeToken.update(
      { active: false },
      {
        where: {
          id: { [Op.ne]: instance.id },
          dataId: instance.dataId,
          active: true
        }
      }
    );
  }

  @BeforeCreate @BeforeUpdate
  static async encrypt(instance: any) {
    const { hash } = bcryptjs
    const tokenString = instance.token.toString();
    const hashedToken = await hash(tokenString, 10);
    instance.token = hashedToken;
  }
}