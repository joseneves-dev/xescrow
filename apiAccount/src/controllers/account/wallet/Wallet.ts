import { Response, Request, NextFunction } from "express";

import { AppBlockchainTokens } from "../../../database/models/app/AppBlockchainTokens";
import { AppCurrencies } from "../../../database/models/app/AppCurrencies";
import { AppBlockchains } from "../../../database/models/app/AppBlockchains";

import { UserWallet } from "../../../database/models/account/UserWallet";
import { WalletAccount } from "../../../database/models/account/WalletAccount";
import { PublicKeyBalance } from "../../../database/models/account/PublicKeyBalance";
import { TokenAccount } from "../../../database/models/account/TokenAccount";
import { AccountData } from "../../../database/models/account/AccountData";

import {
  create as createAccount,
  get as getAccount,
} from "../../../helpers/solana/Account";
import {
  create as createTokenAccount,
  mint,
  getByOwner,
} from "../../../helpers/solana/TokenAccount";

import { verifySecretKey } from "../../../helpers/solana/Solana";

import { getBalance } from "../../../helpers/account/wallet/Wallet";

import { errorHandler, AppError } from "../../../errors/ErrorHandling";

interface defaultCurrency {
  name: string;
  symbol: string;
}

export default class Wallet {
  static async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const blockchain = await AppBlockchains.findOne({
        include: [
          {
            association: "metaData",
            where: {
              name: req.body.blockchain,
            },
          },
          {
            association: "tokens",
          },
        ],
      });

      const blockchainTokens = await AppBlockchainTokens.findOne({
        include: {
          association: "metaData",
          where: {
            name: req.body.token,
          },
        },
      });

      if (!blockchain || blockchain.metaData.name !== "Solana") {
        throw new AppError({ message: "blockcahin.invalid", statusCode: 400 });
      }

      let userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
      });

      let newWallet: boolean = false,
        defaultAccount: string,
        defaultCurrency: defaultCurrency;

      if (!userWallet) {
        if (!req.body.currency) {
          throw new AppError({ message: "currency.invalid", statusCode: 400 });
        }

        const currencies = await AppCurrencies.findOne({
          where: { name: req.body.currency },
        });

        if (!currencies) {
          throw new AppError({ message: "currency.invalid", statusCode: 400 });
        }

        newWallet = true;
        userWallet = await UserWallet.create({
          userId: req.user.id,
          currencyId: currencies.id,
        });

        defaultCurrency = {
          name: currencies.name,
          symbol: currencies.symbol,
        };
      }

      const { publicKey: accountPublicKey, secretKey: accountSecretKey } =
        await createAccount();

      const { publicKey: tokenAccountPublicKey } = await createTokenAccount(
        blockchainTokens.mint,
        accountPublicKey
      );

      if (newWallet) {
        defaultAccount = accountPublicKey;
        userWallet.defaultAccount = defaultAccount;
        await userWallet.save();
      }

      await WalletAccount.create(
        {
          publicKey: accountPublicKey,
          walletId: userWallet.id,
          blockchainId: blockchain.id,
          tokenAccounts: {
            tokenId: blockchainTokens.id,
            publicKey: tokenAccountPublicKey,
            state: "active",
          },
        },
        {
          include: {
            association: "tokenAccounts",
          },
        }
      );

      PublicKeyBalance.create({
        publicKey: accountPublicKey,
        balance: 0,
      });

      PublicKeyBalance.create({
        publicKey: tokenAccountPublicKey,
        balance: 0,
      });

      res.send({
        publicKey: accountPublicKey,
        secretKey: accountSecretKey,
        wallet: {
          defaultAccount,
          defaultCurrency,
          accounts: {
            [accountPublicKey]: {
              publicKey: accountPublicKey,
              secretKey: false,
              balance: 0,
              tokenAccounts: {
                [tokenAccountPublicKey]: {
                  publicKey: tokenAccountPublicKey,
                  balance: 0,
                  metaData: {
                    mint: blockchainTokens.mint,
                    symbol: blockchainTokens.metaData.symbol,
                    name: blockchainTokens.metaData.name,
                  },
                },
              },
              metaData: {
                symbol: blockchain.metaData.symbol,
                name: blockchain.metaData.name,
              },
            },
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async createTokenAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
        },
        include: {
          association: "account",
          where: {
            publicKey: req.body.publicKey,
          },
        },
      });

      if (!userWallet) {
        throw new AppError({ message: "wallet.invalid", statusCode: 200 });
      }

      const blockchainTokens = await AppBlockchainTokens.findOne({
        include: {
          association: "metaData",
          where: {
            name: req.body.token,
          },
        },
      });

      if (!blockchainTokens) {
        throw new AppError({
          message: "blockcahin.invalid",
          statusCode: 200,
        });
      }

      const { publicKey } = await createTokenAccount(
        blockchainTokens.mint,
        req.body.publicKey
      );

      await TokenAccount.create({
        accountId: userWallet.account.id,
        tokenId: blockchainTokens.id,
        publicKey: publicKey,
        state: "active",
      });

      res.send({
        wallet: {
          accounts: {
            [req.body.publicKey]: {
              publicKey: req.body.publicKey,
              secretKey: false,
              tokenAccounts: {
                [publicKey]: {
                  publicKey: publicKey,
                  balance: 0,
                  metaData: {
                    mint: blockchainTokens.mint,
                    name: blockchainTokens.metaData.name,
                    symbol: blockchainTokens.metaData.symbol,
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async import(req: Request, res: Response, next: NextFunction) {
    try {
      const walletAccount = await WalletAccount.findOne({
        where: {
          publicKey: req.body.publicKey,
          active: true,
        },
        include: {
          association: "wallet",
          where: {
            userId: req.user.id,
            active: true,
          },
        },
      });

      if (walletAccount) {
        throw new AppError({
          message: "publicKey.duplicated",
          statusCode: 400,
        });
      }

      const blockchains = await AppBlockchains.findOne({
        include: {
          association: "metaData",
          where: {
            name: req.body.blockchain,
          },
        },
      });

      if (!blockchains || blockchains.metaData.name !== "Solana") {
        throw new AppError({ message: "blockcahin.invalid", statusCode: 200 });
      }

      let userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
      });

      let newWallet: boolean = false,
        defaultAccount: string,
        defaultCurrency: defaultCurrency;

      if (!userWallet) {
        if (!req.body.currency) {
          throw new AppError({ message: "currency.invalid", statusCode: 400 });
        }

        const currencies = await AppCurrencies.findOne({
          where: { name: req.body.currency },
        });

        if (!currencies) {
          throw new AppError({ message: "currency.invalid", statusCode: 200 });
        }

        newWallet = true;
        userWallet = await UserWallet.create({
          userId: req.user.id,
          currencyId: currencies.id,
        });

        defaultCurrency = {
          name: currencies.name,
          symbol: currencies.symbol,
        };
      }
      var account = await getAccount(req.body.publicKey);

      var { tokenAccounts } = await getByOwner(account.publicKey);

      if (newWallet) {
        defaultAccount = account.publicKey;
        userWallet.defaultAccount = defaultAccount;
        await userWallet.save();
      }

      await WalletAccount.create(
        {
          publicKey: account.publicKey,
          walletId: userWallet.id,
          blockchainId: blockchains.id,
          tokenAccounts: Object.values(tokenAccounts).map((account) => ({
            tokenId: account.tokenId,
            publicKey: account.publicKey,
            state: account.state,
          })),
        },
        {
          include: {
            association: "tokenAccounts",
          },
        }
      );

      PublicKeyBalance.create({
        publicKey: account.publicKey,
        balance: account.balance,
      });
      Object.values(tokenAccounts).map((account) => {
        PublicKeyBalance.create({
          publicKey: account.publicKey,
          balance: account.balance,
        });
      });

      res.send({
        wallet: {
          defaultCurrency,
          defaultAccount,
          accounts: {
            [account.publicKey]: {
              ...account,
              metaData: {
                symbol: blockchains.metaData.symbol,
                name: blockchains.metaData.name,
              },
              tokenAccounts,
            },
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async connect(req: Request, res: Response, next: NextFunction) {
    try {
      const walletAccount = await WalletAccount.findOne({
        where: {
          publicKey: req.body.publicKey,
          active: true,
        },
        include: {
          association: "wallet",
          where: {
            userId: req.user.id,
            active: true,
          },
        },
      });

      if (walletAccount) {
        throw new AppError({
          message: "publicKey.duplicated",
          statusCode: 200,
        });
      }

      const blockchains = await AppBlockchains.findOne({
        include: {
          association: "metaData",
          where: {
            name: req.body.blockchain,
          },
        },
      });

      if (!blockchains || blockchains.metaData.name !== "Solana") {
        throw new AppError({ message: "blockchain.invalid", statusCode: 200 });
      }

      let userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
      });

      let newWallet: boolean = false,
        defaultAccount: string,
        defaultCurrency: defaultCurrency;

      if (!userWallet) {
        if (!req.body.currency) {
          throw new AppError({ message: "currency.invalid", statusCode: 400 });
        }
        const currencies = await AppCurrencies.findOne({
          where: { name: req.body.currency },
        });

        if (!currencies) {
          throw new AppError({ message: "currency.invalid", statusCode: 200 });
        }

        newWallet = true;
        userWallet = await UserWallet.create({
          userId: req.user.id,
          currencyId: currencies.id,
        });

        defaultCurrency = {
          name: currencies.name,
          symbol: currencies.symbol,
        };
      }
      var account = await getAccount(req.body.publicKey);
      var { tokenAccounts } = await getByOwner(account.publicKey);

      if (newWallet) {
        defaultAccount = account.publicKey;
        userWallet.defaultAccount = defaultAccount;
        await userWallet.save();
      }

      await WalletAccount.create(
        {
          publicKey: account.publicKey,
          walletId: userWallet.id,
          blockchainId: blockchains.id,
          tokenAccounts: Object.values(tokenAccounts).map((account) => ({
            tokenId: account.tokenId,
            publicKey: account.publicKey,
            state: account.state,
          })),
        },
        {
          include: {
            association: "tokenAccounts",
          },
        }
      );

      PublicKeyBalance.create({
        publicKey: account.publicKey,
        balance: account.balance,
      });

      Object.values(tokenAccounts).map((account) => {
        PublicKeyBalance.create({
          publicKey: account.publicKey,
          balance: account.balance,
        });
      });

      res.send({
        wallet: {
          defaultCurrency,
          defaultAccount,
          accounts: {
            [account.publicKey]: {
              ...account,
              metaData: {
                symbol: blockchains.metaData.symbol,
                name: blockchains.metaData.name,
              },
              tokenAccounts,
            },
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
        include: [
          {
            association: "accounts",
            where: {
              active: true,
            },
            include: [
              {
                association: "tokenAccounts",
                attributes: ["publicKey", "state"],
                include: {
                  association: "token",
                  include: {
                    association: "metaData",
                  },
                },
              },
              {
                association: "data",
              },
              {
                association: "blockchain",
                include: {
                  association: "metaData",
                },
              },
            ],
          },
          {
            association: "currency",
            attributes: ["name", "symbol"],
          },
        ],
      });

      if (!userWallet || !userWallet.accounts) {
        throw new AppError({ statusCode: 200 });
      }
      const buildAccounts = [];

      for (const account of userWallet.accounts) {
        const secretKey = account.data ? true : false;
        const buildTokenAccounts = account.tokenAccounts ? [] : null;
        if (account.tokenAccounts) {
          for (const tokenAccount of account.tokenAccounts) {
            const accountObject = {
              publicKey: tokenAccount.publicKey,
              metaData: {
                mint: tokenAccount.token.mint,
                symbol: tokenAccount.token.metaData.symbol,
                name: tokenAccount.token.metaData.name,
              },
            };
            buildTokenAccounts.push({
              [tokenAccount.publicKey]: accountObject,
            });
          }
        }

        const tokenAccounts = buildTokenAccounts
          ? Object.assign({}, ...buildTokenAccounts)
          : {};
        const accountObject = {
          publicKey: account.publicKey,
          secretKey: secretKey,
          rename: account.rename,
          metaData: {
            symbol: account.blockchain.metaData.symbol,
            name: account.blockchain.metaData.name,
          },
          tokenAccounts,
        };

        buildAccounts.push({ [account.publicKey]: accountObject });
      }

      const accounts = Object.assign({}, ...buildAccounts);

      res.send({
        wallet: {
          defaultAccount: userWallet.defaultAccount,
          defaultCurrency: userWallet.currency,
          accounts,
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async saveSecretKey(req: Request, res: Response, next: NextFunction) {
    try {
      const publicKey = req.body.publicKey;
      const secretKey = req.body.secretKey;

      await verifySecretKey(publicKey, secretKey);

      const walletAccount = await WalletAccount.findOne({
        where: {
          publicKey: publicKey,
          active: true,
        },
        include: {
          association: "wallet",
          where: {
            userId: req.user.id,
            active: true,
          },
        },
      });

      if (!walletAccount) {
        throw new AppError({
          message: "pages.wallet.secretKey.invalid",
          statusCode: 200,
        });
      }

      await AccountData.create({
        accountId: walletAccount.id,
        secretKey: secretKey,
      });

      res.send({
        wallet: {
          accounts: {
            [publicKey]: {
              publicKey: publicKey,
              secretKey: true,
            },
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async getBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
        include: [
          {
            association: "account",
            where: {
              publicKey: req.query.publicKey,
              active: true,
            },
            required: true,
            include: [
              {
                association: "tokenAccounts",
                attributes: ["publicKey", "state"],
                include: {
                  association: "token",
                  include: {
                    association: "metaData",
                  },
                },
              },
              {
                association: "data",
              },
              {
                association: "blockchain",
                include: {
                  association: "metaData",
                },
              },
            ],
          },
        ],
      });

      if (!userWallet) {
        throw new AppError({ message: "wallet.invalid", statusCode: 422 });
      }

      const buildAccounts = [];
      const account = userWallet.account;
      try {
        let balanceAccount: string = "0";
        const blockchainName = account.blockchain.metaData.name;
        const PubKeyBalance = await getBalance(
          blockchainName,
          "account",
          account.publicKey
        );
        balanceAccount = PubKeyBalance.balance;

        const buildTokenAccounts = account.tokenAccounts ? [] : null;
        if (account.tokenAccounts) {
          for (const tokenAccount of account.tokenAccounts) {
            try {
              let balanceTokenAccount: string = "0";
              const PubKeyBalance = await getBalance(
                blockchainName,
                "tokenAccount",
                tokenAccount.publicKey
              );
              balanceTokenAccount = PubKeyBalance.balance;

              const tokenAccountObject = {
                publicKey: tokenAccount.publicKey,
                balance: balanceTokenAccount,
              };

              buildTokenAccounts.push({
                [tokenAccount.publicKey]: tokenAccountObject,
              });
            } catch (error) {
              throw new AppError({
                message: "pages.wallet.balance",
                statusCode: 400,
              });
            }
          }
        }

        const tokenAccounts = buildTokenAccounts
          ? Object.assign({}, ...buildTokenAccounts)
          : {};
        const accountObject = {
          publicKey: account.publicKey,
          balance: balanceAccount,
          tokenAccounts,
        };

        buildAccounts.push({ [account.publicKey]: accountObject });
      } catch (error) {
        throw new AppError({
          message: "pages.wallet.balance",
          statusCode: 400,
        });
      }

      const accounts = Object.assign({}, ...buildAccounts);

      res.send({
        wallet: {
          accounts,
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async airdrop(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenAccount = await TokenAccount.findOne({
        where: {
          publicKey: req.query.tokenAccountPublicKey,
          state: "active",
        },
        include: [
          {
            association: "token",
            include: {
              association: "metaData",
            },
          },
          {
            association: "account",
            where: {
              publicKey: req.query.accountPublicKey,
              active: true,
            },
            include: {
              association: "wallet",
              where: {
                userId: req.user.id,
                active: true,
              },
            },
          },
        ],
      });
      if (!tokenAccount) {
        throw new AppError({
          message: "pages.wallet.airdrop.invalid",
          statusCode: 400,
        });
      }

      const tokenAccountPublicKey = tokenAccount.publicKey;
      const mintPublicKey = tokenAccount.token.mint;
      const tokenAccountMint = mint(tokenAccountPublicKey, mintPublicKey);
      res.send({
        tokenAccountMint,
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }
}
