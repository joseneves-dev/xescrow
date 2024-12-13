"use strict";
import { PostgresDialect } from "@sequelize/postgres";

import { Sequelize } from "@sequelize/core";

import { BlockchainMetaData } from "./models/BlockchainMetaData";
import { BlockchainTokens } from "./models/BlockchainTokens";
import { Blockchains } from "./models/Blockchains";
import { BlockchainTokenMetaData } from "./models/BlockchainTokenMetaData";
import { Languages } from "./models/Languages";
import { Countries } from "./models/Countries";
import { Currencies } from "./models/Currencies";
import { Timezones } from "./models/Timezones";
import { SignUpEmailAddress } from "./models/SignUpEmailAddress";
const models = [
  BlockchainMetaData,
  BlockchainTokens,
  Blockchains,
  BlockchainTokenMetaData,
  Languages,
  Countries,
  Currencies,
  Timezones,
  SignUpEmailAddress,
];
async function initializeDatabase() {
  if (process.env.NODE_ENV == "development") {
    const sequelize = new Sequelize({
      dialect: PostgresDialect,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      minifyAliases: true,
      define: {
        freezeTableName: true,
      },
      models: models,
    });

    await sequelize.sync();
  } else if (process.env.NODE_ENV == "production") {
    const sequelize = new Sequelize({
      dialect: PostgresDialect,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      ssl: {
        rejectUnauthorized: false,
        requestCert: true,
      },
      minifyAliases: true,
      define: {
        freezeTableName: true,
      },
      models: models,
    });

    await sequelize.sync();
  }
}

// Export the initialization function or call it to initialize the database
export default initializeDatabase;
