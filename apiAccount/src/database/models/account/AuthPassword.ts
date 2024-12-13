'use strict';
import bcryptjs from 'bcryptjs';

import { DataTypes, Model, sql, NonAttribute } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, BeforeCreate, BeforeUpdate, BelongsTo } from '@sequelize/core/decorators-legacy';
import { UserAuth } from './UserAuth';

@Table({
  tableName: 'AuthPassword',
    name: {
      singular: 'AuthPassword',
      plural: 'AuthPassword',
    }
})

export class AuthPassword extends Model {

  @BelongsTo(() => UserAuth, 'authId')
  declare auth?: NonAttribute<UserAuth>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare authId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  @BeforeCreate @BeforeUpdate
  static async encrypt(instance: any) {
    const { hash } = bcryptjs
    const hashedPassword = await hash(instance.password, 12);
    instance.password = hashedPassword;
  }
}