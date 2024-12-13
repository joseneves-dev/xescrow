'use strict';
import { DataTypes, Model, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'BlockchainTokenMetaData',
    name: {
      singular: 'BlockchainTokenMetaData',
      plural: 'BlockchainTokenMetaData',
    }
})
 
export class BlockchainTokenMetaData extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;
  
  @Attribute(DataTypes.UUID)
  @NotNull
  declare tokenId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare symbol: string;
}