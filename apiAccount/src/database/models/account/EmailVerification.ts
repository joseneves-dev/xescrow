'use strict';
import bcryptjs from 'bcryptjs';
import { DateTime } from 'luxon';

import { DataTypes, Model, sql, Op, NonAttribute} from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, BeforeCreate, BeforeUpdate, BelongsTo} from '@sequelize/core/decorators-legacy';
import { UserEmailAddress } from './UserEmailAddress';

@Table({
  tableName: 'EmailVerification',
    name: {
      singular: 'EmailVerification',
      plural: 'EmailVerification',
    }
})

export class EmailVerification extends Model {

  @BelongsTo(() => UserEmailAddress, 'emailId')
  declare email?: NonAttribute<UserEmailAddress>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare emailId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare token: string;

  @Attribute(DataTypes.DATE)
  declare nextRequest: Date;

  @Attribute(DataTypes.DATE)
  declare expires: Date;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

 @BeforeCreate
  static async expire(instance: any) { 
    instance.expires = DateTime.fromJSDate(instance.createdAt).plus({ minutes: 10 }).toJSDate();
    instance.nextRequest = DateTime.fromJSDate(instance.createdAt).plus({ minute: 1 }).toJSDate();
  }

  @BeforeCreate
  static async deactivate(instance: any){
    await EmailVerification.update(
      { active: false },
      {
        where: {
          id: { [Op.ne]: instance.id },
          emailId: instance.emailId,
          active: true
        }
      }
    );
  }

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