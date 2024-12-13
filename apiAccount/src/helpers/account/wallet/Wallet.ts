import { createDecipheriv } from "crypto";
import bcryptjs from "bcryptjs";
import { DateTime } from "luxon";

import { Op } from "@sequelize/core";

import { AccountData } from "../../../database/models/account/AccountData";
import { PublicKeyBalance } from "../../../database/models/account/PublicKeyBalance";
import { CryptoIV } from "../../../database/models/account/CryptoIV";

import { OneTimeToken } from "../../../database/models/account/OneTimeToken";
import { OneTimeNotification } from "../../../database/models/account/OneTimeNotification";

import { get as getAccount } from "../../solana/Account";
import { get as getTokenAccount } from "../../solana/TokenAccount";

import { AppError } from "../../../errors/ErrorHandling";

export async function secretKey(
  publicKey: string,
  token: string,
  userId: string
) {
  try {
    let secretKey: string;

    const addressData = await AccountData.findOne({
      include: [
        {
          association: "account",
          where: {
            publicKey: publicKey,
            active: true,
          },
          required: true,
          include: {
            association: "wallet",
            where: {
              userId: userId,
              active: true,
            },
          },
        },
      ],
    });

    if (!addressData) {
      throw new AppError({ message: "wallet.invalid", statusCode: 422 });
    }

    // Retrieve the corresponding record from CryptoIV table
    const cryptoIV = await CryptoIV.findOne({
      where: { dataId: addressData.id },
    });
    // Create a decipher using the same algorithm, key, and IV
    const decipher = createDecipheriv(
      "aes-256-ctr",
      Buffer.from(process.env.CLIENT_TOKEN_SECRETKEY, "hex"),
      Buffer.from(cryptoIV.iv, "hex")
    );

    // Decrypt the secretKey
    secretKey = decipher.update(addressData.secretKey, "hex", "utf-8");
    secretKey += decipher.final("utf-8");

    return { publicKey, secretKey };
  } catch (error) {
    throw error;
  }
}
/*
THIS METHOD IS DISABLE FOR TESTING PORPOSES
export async function secretKey(
  publicKey: string,
  token: string,
  userId: string
) {
  try {
    let secretKey: string;

    const addressData = await AccountData.findOne({
      include: [
        {
          association: "account",
          where: {
            publicKey: publicKey,
            active: true,
          },
          required: true,
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
          required: true,
          where: {
            active: true,
          },
        },
      ],
      order: [["request", "createdAt", "DESC"]],
    });

    if (!addressData) {
      throw new AppError({ message: "wallet.invalid", statusCode: 422 });
    }

    const currentDateTime = DateTime.local();

    if (addressData.request.method === "app") {
      const oneTimeNotification = await OneTimeNotification.findOne({
        where: {
          dataId: addressData.request.id,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!oneTimeNotification) {
        throw new AppError({
          message: "notification.invalid",
          statusCode: 422,
        });
      }
    } else if (
      addressData.request.method === "emailAddress" ||
      addressData.request.method === "phoneNumber"
    ) {
      const oneTimeToken = await OneTimeToken.findOne({
        where: {
          dataId: addressData.request.id,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      const { compareSync } = bcryptjs;

      if (!oneTimeToken || !compareSync(token, oneTimeToken.token)) {
        throw new AppError({ message: "token.invalid", statusCode: 422 });
      }

      // Retrieve the corresponding record from CryptoIV table
      const cryptoIV = await CryptoIV.findOne({
        where: { dataId: addressData.id },
      });
      // Create a decipher using the same algorithm, key, and IV
      const decipher = createDecipheriv(
        "aes-256-ctr",
        Buffer.from(process.env.CLIENT_TOKEN_SECRETKEY, "hex"),
        Buffer.from(cryptoIV.iv, "hex")
      );

      // Decrypt the secretKey
      secretKey = decipher.update(addressData.secretKey, "hex", "utf-8");
      secretKey += decipher.final("utf-8");

      oneTimeToken.active = false;
      await oneTimeToken.save();

      return { publicKey, secretKey };
    }
  } catch (error) {
    throw error;
  }
}
*/
export async function getBalance(
  blockchain: string,
  type: "account" | "tokenAccount",
  publicKey: string
) {
  if (blockchain !== "Solana") {
    throw new AppError({ message: "blockchain.invalid", statusCode: 422 });
  }

  if (type === "account") {
    const { publicKey: addressPublicKey, balance: addressBalance } =
      await getAccount(publicKey);

    PublicKeyBalance.upsert({
      publicKey: addressPublicKey,
      balance: addressBalance,
    });

    return {
      publicKey: addressPublicKey,
      balance: addressBalance,
    };
  } else if (type === "tokenAccount") {
    const { publicKey: accountPublicKey, balance: accountBalance } =
      await getTokenAccount(publicKey);

    PublicKeyBalance.upsert({
      publicKey: accountPublicKey,
      balance: accountBalance,
    });

    return {
      publicKey: accountPublicKey,
      balance: accountBalance,
    };
  } else {
    throw new AppError({ message: "pages.wallet.balance", statusCode: 400 });
  }
}
