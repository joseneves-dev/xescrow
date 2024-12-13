'use strict';
import bcryptjs from 'bcryptjs';
import { DateTime } from 'luxon';

import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, BeforeCreate } from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'AuthPasswordReset',
    name: {
      singular: 'AuthPasswordReset',
      plural: 'AuthPasswordReset',
    }
})

export class AuthPasswordReset extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare authId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare request: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare token: string;

  @Attribute(DataTypes.DATE)
  declare expires: Date;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  @BeforeCreate
  static async encrypt(instance: any) {
    const { hash } = bcryptjs;
    const hashedToken = await hash(instance.token, 5);
    instance.token = hashedToken;
  }

  @BeforeCreate
  static async expire(instance: any) { 
    instance.expires = DateTime.fromJSDate(instance.createdAt).plus({ minutes: 10 }).toJSDate();
  }
}