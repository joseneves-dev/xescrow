'use strict';
import { DataTypes, Model, NonAttribute, sql } from '@sequelize/core';
import { Attribute, Table, PrimaryKey, NotNull ,Default, HasMany, HasOne} from '@sequelize/core/decorators-legacy';
import { BlockchainMetaData } from './BlockchainMetaData';
import { BlockchainTokens } from './BlockchainTokens';

@Table({
  tableName: 'Blockchains',
    name: {
      singular: 'Blockchains',
      plural: 'Blockchains',
    }
})

export class Blockchains extends Model {
  @HasOne(() => BlockchainMetaData, 'blockchainId')
  declare metaData?: NonAttribute<BlockchainMetaData>;

  @HasMany(() => BlockchainTokens, 'blockchainId')
  declare tokens?: NonAttribute<BlockchainTokens>;
  
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare programId: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare decimals: number;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;
}
