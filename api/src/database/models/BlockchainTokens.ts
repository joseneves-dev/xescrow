'use strict';
import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default, HasOne, BelongsTo} from '@sequelize/core/decorators-legacy';
import { BlockchainTokenMetaData } from './BlockchainTokenMetaData';
import { Blockchains } from './Blockchains';

@Table({
  tableName: 'BlockchainTokens',
    name: {
      singular: 'BlockchainTokens',
      plural: 'BlockchainTokens',
    }
})


export class BlockchainTokens extends Model {
  @HasOne(() => BlockchainTokenMetaData, 'tokenId')
  declare metaData?: NonAttribute<BlockchainTokenMetaData>

  @BelongsTo(() => Blockchains, 'blockchainId')
  declare blockchain?: NonAttribute<BlockchainTokenMetaData>

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare blockchainId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare programId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare mint: string;
  
  @Attribute(DataTypes.STRING)
  @NotNull
  declare mintAutority: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare decimals: number;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}