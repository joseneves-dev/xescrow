'use strict';
import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, HasMany, HasOne, BelongsTo } from '@sequelize/core/decorators-legacy';

import { SessionData } from './SessionData'
import { SessionToken } from './SessionToken'
import { UserAuth } from './UserAuth';

@Table({
  tableName: 'AuthSession',
    name: {
      singular: 'AuthSession',
      plural: 'AuthSession',
    }
})

export class AuthSession extends Model {
  
  @HasOne(() => SessionData, 'sessionId')
  declare data?: NonAttribute<SessionData>

  @HasMany(() => SessionToken, 'sessionId')
  declare tokens?: NonAttribute<SessionToken[]>

  @HasOne(() => SessionToken, 'sessionId')
  declare token?: NonAttribute<SessionToken>

  @BelongsTo(() => UserAuth, 'authId')
  declare auth?: NonAttribute<UserAuth>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare authId: string;

  @Attribute(DataTypes.BOOLEAN)
  declare success: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
} 
