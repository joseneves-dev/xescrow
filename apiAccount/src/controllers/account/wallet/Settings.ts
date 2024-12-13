import { Response, Request, NextFunction } from "express";

import bcryptjs from "bcryptjs";
import { DateTime } from "luxon";

import { Op } from "@sequelize/core";

import { AppCurrencies } from "../../../database/models/app/AppCurrencies";

import { UserWallet } from "../../../database/models/account/UserWallet";
import { WalletAccount } from "../../../database/models/account/WalletAccount";
import { AccountData } from "../../../database/models/account/AccountData";
import { AccountDataRequest } from "../../../database/models/account/AccountDataRequest";
import { AccountDataRemove } from "../../../database/models/account/AccountDataRemove";

import { OneTimeToken } from "../../../database/models/account/OneTimeToken";
import { OneTimeNotification } from "../../../database/models/account/OneTimeNotification";

import { secretKey as getSecretKey } from "../../../helpers/account/wallet/Wallet";

import {
  viewSecretKey as emailSecretKey,
  removeSecretKey as emailRemoveSecretKey,
} from "../../../helpers/communications/email/Wallet";

import { requestMethod } from "../../../helpers/communications/Communication";

import { convertSeconds } from "../../../utils/Tools";

import { errorHandler, AppError } from "../../../errors/ErrorHandling";

export default class Settings {
  static async defaultAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
        include: {
          association: "accounts",
          where: {
            publicKey: req.body.publicKey,
            active: true,
          },
        },
        order: [["accounts", "createdAt", "DESC"]],
      });
      if (!userWallet) {
        throw new AppError({ message: "invalid account ", statusCode: 200 });
      }

      userWallet.set({ defaultAccount: req.body.publicKey });
      await userWallet.save();

      res.send({
        wallet: {
          defaultAccount: req.body.publicKey,
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async defaultCurrency(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
        },
        order: [["createdAt", "DESC"]],
      });

      const currency = await AppCurrencies.findOne({
        where: {
          name: req.body.currency,
        },
        attributes: ["id", "name", "symbol"],
      });

      userWallet.set({ currencyId: currency.id });
      await userWallet.save();

      res.send({
        wallet: {
          defaultCurrency: {
            name: currency.name,
            symbol: currency.symbol,
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async requestSecretKey(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestedMethod = req.body.method;
      const publicKey = req.body.publicKey;
      const userId = req.user.id;

      const currentDateTime = DateTime.local();

      const addressData = await AccountData.findOne({
        include: [
          {
            association: "accounts",
            where: {
              publicKey: publicKey,
              active: true,
            },
            include: {
              association: "wallet",
              where: {
                userId: userId,
                active: true,
              },
            },
          },
          {
            association: "request",
            where: {
              expires: {
                [Op.gte]: currentDateTime,
              },
              active: true,
            },
          },
        ],
      });

      if (!addressData) {
        throw new AppError({
          message: "pages.wallet.settings.secretKey.invalid",
          statusCode: 200,
        });
      }

      const oneTimeToken = await OneTimeToken.findOne({
        where: {
          dataId: addressData.request.id,
          active: true,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      const oneTimeNotification = await OneTimeNotification.findOne({
        where: {
          dataId: addressData.request.id,
          active: true,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!oneTimeToken && !oneTimeNotification) {
        throw new AppError({
          message: "token.invalid",
          statusCode: 422,
        });
      }

      let nextRequest: number = 0;

      if (oneTimeNotification) {
        nextRequest = await convertSeconds(oneTimeNotification.nextRequest);
      }

      if (oneTimeToken) {
        nextRequest = await convertSeconds(oneTimeToken.nextRequest);
      }

      if (nextRequest > 0) {
        throw new AppError({ message: "nextRequest.invalid", statusCode: 422 });
      }

      const { method } = await requestMethod(requestedMethod, userId);

      if (Object.keys(method).length !== 0) {
        throw new AppError({ message: "method.invalid", statusCode: 422 });
      }
      addressData.request.active = false;
      await addressData.request.save();

      const addressDataRequest = await AccountDataRequest.create({
        accountId: addressData.id,
        method: method,
        active: true,
      });

      let message: string;

      const token = Math.floor(Math.random() * 900000) + 100000;

      if (method.type == "emailAddress") {
        await OneTimeToken.create({
          dataId: addressDataRequest.id,
          token: token.toString(),
        });

        emailSecretKey(userId, method.email, token.toString());

        message = "pages.wallet.secretKey.emailAddress.sent";
      } else if (method.type == "phoneNumber") {
        await OneTimeToken.create({
          dataId: addressDataRequest.id,
          token: token.toString(),
        });

        message = "pages.wallet.secretKey.phoneNumber.sent";
      } else if (method.type == "app") {
        await OneTimeNotification.create({ dataId: addressDataRequest.id });
        message = "pages.wallet.secretKey.app.sent";
      }

      res.send({
        message,
        wallet: {
          secretKey: {
            method: method.type,
            nextRequest: method.nextRequest,
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async viewSecretKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { publicKey, secretKey } = await getSecretKey(
        req.body.publicKey,
        req.body.token,
        req.user.id
      );

      res.send({
        publicKey: publicKey,
        secretKey: secretKey,
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async requestRemove(req: Request, res: Response, next: NextFunction) {
    try {
      const requestedMethod = req.body.method;
      const publicKey = req.body.publicKey;
      const userId = req.user.id;

      const currentDateTime = DateTime.local();

      const addressData = await AccountData.findOne({
        include: [
          {
            association: "accounts",
            where: {
              publicKey: publicKey,
              active: true,
            },
            include: {
              association: "wallet",
              where: {
                userId: userId,
                active: true,
              },
            },
          },
          {
            association: "remove",
            where: {
              expires: {
                [Op.gte]: currentDateTime,
              },
              active: true,
            },
          },
        ],
      });

      if (!addressData) {
        throw new AppError({
          message: "pages.wallet.settings.secretKey.invalid",
          statusCode: 200,
        });
      }

      const oneTimeToken = await OneTimeToken.findOne({
        where: {
          dataId: addressData.remove.id,
          active: true,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      const oneTimeNotification = await OneTimeNotification.findOne({
        where: {
          dataId: addressData.remove.id,
          active: true,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!oneTimeToken && !oneTimeNotification) {
        throw new AppError({
          message: "token.invalid",
          statusCode: 422,
        });
      }

      let nextRequest: number = 0;

      if (oneTimeNotification) {
        nextRequest = await convertSeconds(oneTimeNotification.nextRequest);
      }

      if (oneTimeToken) {
        nextRequest = await convertSeconds(oneTimeToken.nextRequest);
      }

      if (nextRequest > 0) {
        throw new AppError({ message: "nextRequest.invalid", statusCode: 422 });
      }

      const { method } = await requestMethod(requestedMethod, userId);

      if (Object.keys(method).length !== 0) {
        throw new AppError({ message: "method.invalid", statusCode: 422 });
      }

      addressData.remove.active = false;
      await addressData.remove.save();

      const addressDataRemove = await AccountDataRemove.create({
        accountId: addressData.id,
        method: method,
        active: true,
      });

      let message: string;

      const token = Math.floor(Math.random() * 900000) + 100000;

      if (method.type == "emailAddress") {
        await OneTimeToken.create({
          dataId: addressDataRemove.id,
          token: token.toString(),
        });

        emailRemoveSecretKey(userId, method.email, token.toString());

        message = "pages.wallet.secretKey.emailAddress.sent";
      } else if (method.type == "phoneNumber") {
        await OneTimeToken.create({
          dataId: addressDataRemove.id,
          token: token.toString(),
        });

        message = "pages.wallet.secretKey.phoneNumber.sent";
      } else if (method.type == "app") {
        await OneTimeNotification.create({ dataId: addressDataRemove.id });
        message = "pages.wallet.secretKey.app.sent";
      }

      res.send({
        message,
        wallet: {
          secretKey: {
            method: method.type,
            nextRequest: method.nextRequest,
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async removeSecretKey(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const addressData = await AccountData.findOne({
        include: [
          {
            association: "account",
            where: {
              publicKey: req.body.publicKey,
              active: true,
            },
            required: true,
            include: {
              association: "wallet",
              where: {
                userId: req.user.id,
                active: true,
              },
            },
          },
          {
            association: "remove",
            required: true,
            where: {
              active: true,
            },
          },
        ],
        order: [["remove", "createdAt", "DESC"]],
      });

      if (!addressData) {
        throw new AppError({ message: "wallet.invalid", statusCode: 422 });
      }

      const currentDateTime = DateTime.local();

      const publicKey = addressData.account.publicKey;

      if (addressData.remove.method === "app") {
        const oneTimeNotification = await OneTimeNotification.findOne({
          where: {
            dataId: addressData.remove.id,
            expires: {
              [Op.gte]: currentDateTime,
            },
          },
          order: [["createdAt", "DESC"]],
        });
      } else if (
        addressData.remove.method === "emailAddress" ||
        addressData.remove.method === "phoneNumber"
      ) {
        const oneTimeToken = await OneTimeToken.findOne({
          where: {
            dataId: addressData.remove.id,
            expires: {
              [Op.gte]: currentDateTime,
            },
          },
          order: [["createdAt", "DESC"]],
        });

        const { compareSync } = bcryptjs;

        if (oneTimeToken && !compareSync(req.body.token, oneTimeToken.token)) {
          throw new AppError({ message: "token.invalid", statusCode: 400 });
        }

        oneTimeToken.active = false;
        await oneTimeToken?.save();

        await addressData.destroy();
      }
      res.send({
        message: "pages.wallet.settings.remove.secretKey.sucess",
        wallet: {
          accounts: {
            [publicKey]: {
              publicKey: publicKey,
              secretKey: false,
            },
          },
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async renameAccount(req: Request, res: Response, next: NextFunction) {
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

    if (!walletAccount) {
      throw new AppError({ message: "wallet.invalid", statusCode: 200 });
    }

    walletAccount.set({ rename: req.body.rename });
    await walletAccount.save();

    res.send({
      wallet: {
        accounts: {
          [req.body.publicKey]: {
            publicKey: req.body.publicKey,
            rename: req.body.rename,
          },
        },
      },
    });
  }

  static async removeAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const walletAccount = await WalletAccount.findOne({
        where: {
          active: true,
          publicKey: req.body.publicKey,
        },
        include: [
          {
            association: "wallet",
            where: {
              userId: req.user.id,
              active: true,
            },
          },
          {
            association: "data",
            include: {
              association: "remove",
              required: true,
              where: {
                active: true,
              },
            },
          },
        ],
        order: [["data", "createdAt", "DESC"]],
      });

      if (!walletAccount) {
        throw new AppError({ message: "wallet.invalid", statusCode: 400 });
      }

      if (walletAccount.data) {
        if (!walletAccount.data.remove) {
          throw new AppError({ message: "wallet.invalid", statusCode: 422 });
        }

        const currentDateTime = DateTime.local();

        if (walletAccount.data.remove.method === "app") {
          const oneTimeNotification = await OneTimeNotification.findOne({
            where: {
              dataId: walletAccount.data.remove.id,
              expires: {
                [Op.gte]: currentDateTime,
              },
            },
            order: [["createdAt", "DESC"]],
          });
        } else if (
          walletAccount.data.remove.method === "emailAddress" ||
          walletAccount.data.remove.method === "phoneNumber"
        ) {
          const oneTimeToken = await OneTimeToken.findOne({
            where: {
              dataId: walletAccount.data.remove.id,
              expires: {
                [Op.gte]: currentDateTime,
              },
            },
            order: [["createdAt", "DESC"]],
          });

          const { compareSync } = bcryptjs;

          if (
            oneTimeToken &&
            !compareSync(req.body.token, oneTimeToken.token)
          ) {
            throw new AppError({ message: "token.invalid", statusCode: 400 });
          }

          oneTimeToken.active = false;
          await oneTimeToken?.save();

          await walletAccount.data.destroy();
          walletAccount.active = false;
          await walletAccount.save();
        }
      } else {
        walletAccount.active = false;
        await walletAccount.save();
      }

      let defaultAccount: string;

      if (walletAccount.wallet.defaultAccount == walletAccount.publicKey) {
        const walletAccount = await WalletAccount.findOne({
          where: {
            userId: req.user.id,
            active: true,
          },
          include: {
            association: "wallet",
          },
        });

        walletAccount.wallet.defaultAccount = walletAccount.publicKey;
        await walletAccount.wallet.save();

        defaultAccount = walletAccount.publicKey;
      }

      res.send({
        publicKey: req.body.publicKey,
        wallet: {
          defaultAccount: defaultAccount,
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }
}
