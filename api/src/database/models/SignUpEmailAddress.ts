'use strict';
import bcryptjs from 'bcryptjs';

import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, BeforeCreate, BeforeUpdate} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'SignUpEmailAddress',
    name: {
      singular: 'SignUpEmailAddress',
      plural: 'SignUpEmailAddress',
    }
})

export class SignUpEmailAddress extends Model {

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;
  
  @Attribute(DataTypes.TEXT)
  @NotNull
  declare token: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  @BeforeCreate @BeforeUpdate
  static async encrypt(instance: any) {
  if(instance.token){
    const { hash } = bcryptjs
    const tokenString = instance.token.toString();
    const hashedToken = await hash(tokenString, 5);
    instance.token = hashedToken;
  }
}
}