'use strict';
import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull, Default, HasOne, BelongsTo, BeforeUpdate} from '@sequelize/core/decorators-legacy';

import { PhoneVerification } from './PhoneVerification';
import { PhoneRemove } from './PhoneRemove';
import { AppCountries } from '../app/AppCountries';
import { User } from './User';

@Table({
  tableName: 'UserPhoneNumber',
    name: {
      singular: 'UserPhoneNumber',
      plural: 'UserPhoneNumber',
    }
})

export class UserPhoneNumber extends Model {

  @HasOne(() => PhoneVerification, 'phoneId')
  declare verification?: NonAttribute<PhoneVerification>

  @HasOne(() => PhoneRemove, 'phoneId')
  declare remove?: NonAttribute<PhoneRemove>

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
  declare number: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare verified: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  
  @BeforeUpdate
  static async deactivate(instance: any){
    if(instance.active === false || instance.verified === true){
      await PhoneVerification.update(
        { active: false },
        {
          where: {
            phoneId:  instance.id,
            active: true
          },
        }
      );

      await PhoneRemove.update(
        { active: false },
        {
          where: {
            phoneId:  instance.id,
            active: true
          },
        }
      );
    }
  }
}

