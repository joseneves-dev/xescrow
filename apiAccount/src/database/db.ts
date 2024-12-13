"use strict";
import { PostgresDialect } from "@sequelize/postgres";

import { Sequelize } from "@sequelize/core";

import { AppBlockchainMetaData } from "./models/app/AppBlockchainMetaData";
import { AppBlockchainRpc } from "./models/app/AppBlockchainRpc";
import { AppBlockchains } from "./models/app/AppBlockchains";
import { AppBlockchainTokenMetaData } from "./models/app/AppBlockchainTokenMetaData";
import { AppBlockchainTokens } from "./models/app/AppBlockchainTokens";
import { AppBlockchainPrograms } from "./models/app/AppBlockchainPrograms";
import { AppCountries } from "./models/app/AppCountries";
import { AppCurrencies } from "./models/app/AppCurrencies";
import { AppLanguages } from "./models/app/AppLanguages";
import { AppSettings } from "./models/app/AppSettings";
import { AppSettingsAuthentication } from "./models/app/AppSettingsAuthentication";
import { AppSettingsContact } from "./models/app/AppSettingsContact";
import { AppTimezones } from "./models/app/AppTimezones";

import { TokenAccountSignature } from "./models/account/TokenAccountSignature";
import { TokenAccountSignatureTransaction } from "./models/account/TokenAccountSignatureTransaction";
import { TokenAccount } from "./models/account/TokenAccount";
import { AccountData } from "./models/account/AccountData";
import { AccountDataRemove } from "./models/account/AccountDataRemove";
import { AccountDataRequest } from "./models/account/AccountDataRequest";
import { AccountSignature } from "./models/account/AccountSignature";
import { AccountSignatureTransaction } from "./models/account/AccountSignatureTransaction";
import { AppVerification } from "./models/account/AppVerification";
import { AuthPassword } from "./models/account/AuthPassword";
import { AuthPasswordReset } from "./models/account/AuthPasswordReset";
import { AuthSession } from "./models/account/AuthSession";
import { AuthTrustedDevice } from "./models/account/AuthTrustedDevice";
import { CryptoIV } from "./models/account/CryptoIV";
import { EmailVerification } from "./models/account/EmailVerification";
import { IdentityDocument } from "./models/account/IdentityDocument";
import { IdentityVerification } from "./models/account/IdentityVerification";
import { OneTimeNotification } from "./models/account/OneTimeNotification";
import { OneTimeToken } from "./models/account/OneTimeToken";
import { PhoneRemove } from "./models/account/PhoneRemove";
import { PhoneVerification } from "./models/account/PhoneVerification";
import { PublicKeyBalance } from "./models/account/PublicKeyBalance";
import { ResidenceDocument } from "./models/account/ResidenceDocument";
import { ResidenceVerification } from "./models/account/ResidenceVerification";
import { SessionData } from "./models/account/SessionData";
import { SessionToken } from "./models/account/SessionToken";
import { User } from "./models/account/User";
import { UserApp } from "./models/account/UserApp";
import { UserAuth } from "./models/account/UserAuth";
import { UserEmailAddress } from "./models/account/UserEmailAddress";
import { UserIdentity } from "./models/account/UserIdentity";
import { UserNotificationsAccount } from "./models/account/UserNotificationsAccount";
import { UserNotificationsMarketing } from "./models/account/UserNotificationsMarketing";
import { UserPhoneNumber } from "./models/account/UserPhoneNumber";
import { UserResidence } from "./models/account/UserResidence";
import { UserRole } from "./models/account/UserRole";
import { UserSettings } from "./models/account/UserSettings";
import { UserWallet } from "./models/account/UserWallet";
import { WalletAccount } from "./models/account/WalletAccount";

const models = [
  AppBlockchainMetaData,
  AppBlockchainRpc,
  AppBlockchains,
  AppBlockchainTokenMetaData,
  AppBlockchainTokens,
  AppBlockchainPrograms,
  AppCountries,
  AppCurrencies,
  AppLanguages,
  AppSettings,
  AppSettingsAuthentication,
  AppSettingsContact,
  AppTimezones,
  TokenAccount,
  TokenAccountSignature,
  TokenAccountSignatureTransaction,
  AccountData,
  AccountDataRemove,
  AccountDataRequest,
  AccountSignature,
  AccountSignatureTransaction,
  AppVerification,
  AuthPassword,
  AuthPasswordReset,
  AuthSession,
  AuthTrustedDevice,
  CryptoIV,
  EmailVerification,
  IdentityDocument,
  IdentityVerification,
  OneTimeNotification,
  OneTimeToken,
  PhoneRemove,
  PhoneVerification,
  PublicKeyBalance,
  ResidenceDocument,
  ResidenceVerification,
  SessionData,
  SessionToken,
  User,
  UserApp,
  UserAuth,
  UserEmailAddress,
  UserIdentity,
  UserNotificationsAccount,
  UserNotificationsMarketing,
  UserPhoneNumber,
  UserResidence,
  UserRole,
  UserSettings,
  UserWallet,
  WalletAccount,
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
