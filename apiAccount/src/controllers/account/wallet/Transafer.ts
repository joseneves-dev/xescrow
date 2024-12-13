import { Response, Request, NextFunction } from "express";

import { UserWallet } from "../../../database/models/account/UserWallet";

import { get, createEscrow } from "../../../helpers/solana/TokenAccount";
import { sendTx, sendTxEscrow } from "../../../helpers/solana/Solana";

import { secretKey as getSecretKey } from "../../../helpers/account/wallet/Wallet";

import { errorHandler, AppError } from "../../../errors/ErrorHandling";

export default class Transafer {
  static async normal(req: Request, res: Response, next: NextFunction) {
    try {
      const userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
        include: {
          association: "account",
          where: {
            publicKey: req.body.transaction.request,
            active: true,
          },
        },
      });

      if (!userWallet) {
        throw new AppError({ message: "invalid address ", statusCode: 200 });
      }

      let secretKey;
      if (req.body.token) {
        ({ secretKey } = await getSecretKey(
          req.body.transaction.request,
          req.body.token,
          req.user.id
        ));
      }

      const { signature } = await sendTx(req.body.tx, secretKey);

      res.send({
        signature,
        message: "pages.wallet.transfer.success",
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async escrow(req: Request, res: Response, next: NextFunction) {
    try {
      const userWallet = await UserWallet.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
        include: {
          association: "account",
          where: {
            publicKey: req.body.transaction.request,
            active: true,
          },
        },
      });

      if (!userWallet) {
        throw new AppError({ message: "invalid address ", statusCode: 200 });
      }

      let secretKey;
      if (req.body.token) {
        ({ secretKey } = await getSecretKey(
          req.body.transaction.request,
          req.body.token,
          req.user.id
        ));
      }

      if (req.body.transaction.escrowAccount) {
        try {
          await get(req.body.transaction.escrowAccount);
        } catch (error) {
          await createEscrow(
            req.body.transaction.mint,
            req.body.transaction.escrowAccount
          );
        }
      }
      let initialize = false;
      if (req.body.transaction.initialize) {
        initialize = true;
      }
      const { signature } = await sendTxEscrow(
        req.body.tx,
        secretKey,
        initialize
      );

      res.send({
        signature,
        message: "pages.wallet.transfer.success",
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }
}
