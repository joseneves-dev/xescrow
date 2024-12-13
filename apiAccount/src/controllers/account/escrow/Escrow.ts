import { Request, Response, NextFunction } from "express";
import {
  getSignature,
  getTxEscrowAccount,
} from "../../../helpers/solana/Solana";
import { WalletAccount } from "../../../database/models/account/WalletAccount";
export default class Escrow {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      res.send({});
    } catch (error) {}
  }

  static async getTxEscrow(req: Request, res: Response, next: NextFunction) {
    const { publicKey } = req.query;
    const userId = req.user.id;

    const walletAccount = await WalletAccount.findOne({
      where: {
        publicKey: publicKey,
        active: true,
      },
      include: [
        {
          association: "wallet",
          attributes: [],
          where: {
            userId: userId,
            active: true,
          },
        },
      ],
    });

    var transactions = [];
    let arraySignatures = [];
    let lastSignature = undefined;

    if (walletAccount) {
      const { signature } = await getSignature(
        walletAccount.publicKey,
        lastSignature
      );
      arraySignatures.push(...signature);

      // Insert new signatures into the database
      for (const signature of arraySignatures) {
        const transaction = await getTxEscrowAccount(signature);

        if (transaction) {
          transactions.push([{ ...signature, data: { ...transaction } }]); // Wrap signature in an array;
        }
      }
    }

    res.send({
      transactions,
    });
  }
}
