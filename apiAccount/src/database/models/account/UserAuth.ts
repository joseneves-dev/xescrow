'use strict';
import { DataTypes, Model, sql, NonAttribute} from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, HasMany, HasOne} from '@sequelize/core/decorators-legacy';

import { AuthPassword } from './AuthPassword';
import { AuthPasswordReset } from './AuthPasswordReset';
import { AuthSession } from './AuthSession';
import { AuthTrustedDevice } from './AuthTrustedDevice';

@Table({
  tableName: 'UserAuth',
    name: {
      singular: 'UserAuth',
      plural: 'UserAuth',
    }
})

export class UserAuth extends Model {

  @HasOne(() => AuthPassword, 'authId')
  declare password?: NonAttribute<AuthPassword>

  @HasOne(() => AuthPasswordReset, 'authId')
  declare passwordReset?: NonAttribute<AuthPasswordReset>

  @HasMany(() => AuthSession, 'authId')
  declare sessions?: NonAttribute<AuthSession[]>

  @HasOne(() => AuthSession, 'authId')
  declare session?: NonAttribute<AuthSession>

  @HasMany(() => AuthTrustedDevice, 'authId')
  declare trustedDevice?: NonAttribute<AuthTrustedDevice>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;
  
  @NotNull
  @Attribute(DataTypes.UUID)
  declare userId: string;

  @Attribute(DataTypes.ENUM('active', 'block', 'close', 'suspended', 'banned'))
  @Default('active')
  declare status: 'active' | 'block' | 'close' | 'suspended' | 'banned';
}