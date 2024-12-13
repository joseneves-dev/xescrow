'use strict';
import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, HasOne, HasMany, BelongsTo} from '@sequelize/core/decorators-legacy';

import { IdentityVerification } from './IdentityVerification';
import { IdentityDocument } from './IdentityDocument';
import { AppCountries } from '../app/AppCountries';

@Table({
  tableName: 'UserIdentity',
    name: {
      singular: 'UserIdentity',
      plural: 'UserIdentity',
    }
})

export class UserIdentity extends Model {

  @HasOne(() => IdentityVerification, 'identityId')
  declare verification?: NonAttribute<IdentityVerification>

  @HasMany(() => IdentityDocument, 'identityId')
  declare document?: NonAttribute<IdentityDocument>

  @BelongsTo(() => AppCountries, 'countryId')
  declare country?: NonAttribute<AppCountries>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare firstName: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare lastName: string;

  @Attribute(DataTypes.STRING)
  declare fullName: string;

  @Attribute(DataTypes.UUID)
  declare countryId: string;

  @Attribute(DataTypes.DATEONLY)
  declare dob: Date;

  @Attribute(DataTypes.STRING)
  declare docNumber: string;
  
  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare verified: boolean;
  
  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}