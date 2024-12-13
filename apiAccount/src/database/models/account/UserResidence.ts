'use strict';
import { DataTypes, Model, NonAttribute, sql} from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, HasOne, HasMany, BelongsTo} from '@sequelize/core/decorators-legacy';

import { ResidenceDocument } from './ResidenceDocument';
import { ResidenceVerification } from './ResidenceVerification';
import { AppCountries } from '../app/AppCountries';

@Table({
  tableName: 'UserResidence',
    name: {
      singular: 'UserResidence',
      plural: 'UserResidence',
    }
})

export class UserResidence extends Model {

  @HasOne(() => ResidenceVerification, 'residenceId')
  declare verification?: NonAttribute<ResidenceVerification>

  @HasMany(() => ResidenceDocument, 'residenceId')
  declare document?: NonAttribute<ResidenceDocument>

  @BelongsTo(() => AppCountries, 'countryId')
  declare country?: NonAttribute<AppCountries>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare countryId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare address1: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare address2: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare areaLvl1: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare areaLvl2: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare areaLvl3: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare zipCode: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare verified: boolean;
  
  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}