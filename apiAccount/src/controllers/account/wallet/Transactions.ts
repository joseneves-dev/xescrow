import { Response, Request, NextFunction } from "express";

import lodash from "lodash";

import { WalletAccount } from "../../../database/models/account/WalletAccount";
import { TokenAccount } from "../../../database/models/account/TokenAccount";
import { AccountSignature } from "../../../database/models/account/AccountSignature";
import { AccountSignatureTransaction } from "../../../database/models/account/AccountSignatureTransaction";
import { TokenAccountSignature } from "../../../database/models/account/TokenAccountSignature";
import { TokenAccountSignatureTransaction } from "../../../database/models/account/TokenAccountSignatureTransaction";

import { getEscrowAccountInfo } from "../../../helpers/solana/TokenAccount";

import {
  getSignature,
  getTxAccount,
  getTxTokenAccount,
} from "../../../helpers/solana/Solana";

export default class Transactions {
  static async get(req: Request, res: Response, next: NextFunction) {
    const { isEmpty } = lodash;

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

    const tokenAccount = await TokenAccount.findOne({
      where: {
        publicKey: publicKey,
      },
      include: [
        {
          association: "account",
          where: {
            active: true,
          },
          include: {
            association: "wallet",
            attributes: [],
            where: {
              userId: userId,
              active: true,
            },
          },
        },
      ],
    });

    var transactions = [];
    let arraySignatures = [];
    let lastSignature = undefined;

    if (walletAccount) {
      const accountSignature = await AccountSignature.findAll({
        where: {
          accountId: walletAccount.id,
        },
        include: {
          association: "transaction",
          as: "data",
          attributes: [
            "programId",
            "instruction",
            "receiver",
            "sender",
            "status",
            "amount",
            "fee",
          ],
        },
        order: [["blockTime", "DESC"]],
      });

      if (accountSignature.length != 0) {
        lastSignature = accountSignature[0].signature;
      }

      const { signature } = await getSignature(
        walletAccount.publicKey,
        lastSignature
      );
      arraySignatures.push(...signature);

      if (!isEmpty(accountSignature)) {
        for (const signature of accountSignature) {
          transactions.push([signature]); // Wrap signature in an array
          // Find the index of the signature to remove
          const indexToRemove = arraySignatures.findIndex(
            (signatureData) => signatureData.signature == signature.signature
          );
          // If the signature exists, remove it
          if (indexToRemove !== -1) {
            arraySignatures.splice(indexToRemove, 1);
          }
        }
      }

      // Insert new signatures into the database
      for (const signature of arraySignatures) {
        const transaction = await getTxAccount(signature);

        if (transaction) {
          transactions.push([{ ...signature, data: { ...transaction } }]); // Wrap signature in an array;
          const newAccountSignature = await AccountSignature.create({
            signature: signature.signature,
            accountId: walletAccount.id,
            blockTime: signature.blockTime,
            confirmationStatus: signature.confirmationStatus,
            err: signature.err,
            memo: signature.memo,
            slot: signature.slot,
          });
          await AccountSignatureTransaction.create({
            accountSignatureId: newAccountSignature.id,
            programId: transaction.programId,
            instruction: transaction.instruction,
            receiver: transaction.receiver,
            sender: transaction.sender,
            status: transaction?.status,
            amount: transaction.amount,
            fee: transaction.fee,
          });
        }
      }
    } else if (tokenAccount) {
      const tokenAccountSignature = await TokenAccountSignature.findAll({
        where: {
          tokenAccountId: tokenAccount.id,
        },
        include: {
          association: "transaction",
          as: "data",
          attributes: [
            "programId",
            "mint",
            "instruction",
            "receiver",
            "sender",
            "data",
            "escrowAccount",
            "escrowAutority",
            "status",
            "amount",
            "fee",
          ],
        },
        order: [["blockTime", "DESC"]],
      });

      if (tokenAccountSignature.length != 0) {
        lastSignature = tokenAccountSignature[0].signature;
      }
      const { signature } = await getSignature(
        tokenAccount.publicKey,
        lastSignature
      );
      arraySignatures.push(...signature);

      if (!isEmpty(tokenAccountSignature)) {
        for (const signature of tokenAccountSignature) {
          transactions.push(signature);
          const indexToRemove = arraySignatures.findIndex(
            (signatureData) => signatureData.signature == signature.signature
          );
          // If the signature exists, remove it
          if (indexToRemove !== -1) {
            arraySignatures.splice(indexToRemove, 1);
          }
        }
      }
      // Insert new signatures into the database
      for (const signature of arraySignatures) {
        if (!signature.err) {
          const transaction = await getTxTokenAccount(signature);

          if (transaction) {
            if (transaction.instruction == "normal") {
              transactions.push({ ...signature, data: { ...transaction } });

              const newTokenAccountSignature =
                await TokenAccountSignature.create({
                  signature: signature.signature,
                  tokenAccountId: tokenAccount.id,
                  blockTime: signature.blockTime,
                  confirmationStatus: signature.confirmationStatus,
                  err: signature.err,
                  memo: signature.memo,
                  slot: signature.slot,
                });

              await TokenAccountSignatureTransaction.create({
                tokenAccountSignatureId: newTokenAccountSignature.id,
                programId: transaction.programId,
                mint: transaction.mint,
                instruction: transaction.instruction,
                receiver: transaction.receiver,
                sender: transaction.sender,
                status: transaction?.status,
                amount: transaction.amount,
                fee: transaction.fee,
              });
            } else if (transaction.instruction == "escrow") {
              transactions.push({
                ...signature,
                data: { ...transaction },
              });

              const newTokenAccountSignature =
                await TokenAccountSignature.create({
                  signature: signature.signature,
                  tokenAccountId: tokenAccount.id,
                  blockTime: signature.blockTime,
                  confirmationStatus: signature.confirmationStatus,
                  err: signature.err,
                  memo: signature.memo,
                  slot: signature.slot,
                });

              await TokenAccountSignatureTransaction.create({
                tokenAccountSignatureId: newTokenAccountSignature.id,
                programId: transaction.programId,
                mint: transaction.mint,
                instruction: transaction.instruction,
                receiver: transaction.receiver,
                sender: transaction.sender,
                status: transaction?.status,
                data: transaction?.data,
                escrowAccount: transaction?.escrowAccount,
                escrowAutority: transaction?.escrowAutority,
                amount: transaction.amount,
                fee: transaction.fee,
              });
            }
          }
        }
      }

      // Step 1: Separate escrow and non-escrow transactions
      const escrowTransactions = [];
      const normalTransactions = [];

      transactions.forEach((current) => {
        if (current.data && current.data.instruction) {
          const instruction = current.data.instruction;
          if (instruction === "escrow") {
            escrowTransactions.push(current);
          } else {
            normalTransactions.push(current);
          }
        }
      });

      // Create a map to group transactions by data.id
      const groupedEscrowTransactions = escrowTransactions.reduce(
        (acc, current) => {
          const escrowAccount = current.data.escrowAccount;

          // If the data.id is already in the map, push the signature
          if (acc[escrowAccount]) {
            acc[escrowAccount].push(current);
          } else {
            // Otherwise, create a new entry in the map with the signature in an array
            acc[escrowAccount] = [current];
          }

          return acc;
        },
        {}
      );

      // Step 3: Iterate over each group and check the status of the first transaction
      Object.values(groupedEscrowTransactions).forEach(
        async (transactionsArray) => {
          const latestTransaction = transactionsArray[0]; // Get the first transaction in each group

          // Check if the status is 'initialized' or 'disputed'
          if (
            latestTransaction.data.status === "initialized" ||
            latestTransaction.data.status === "disputed"
          ) {
            const { status } = await getEscrowAccountInfo(
              latestTransaction.data.data
            );

            if (latestTransaction.data.status != status) {
              latestTransaction.data.status = status;
              await TokenAccountSignatureTransaction.update(
                {
                  status: status,
                },
                {
                  where: { data: latestTransaction.data.data },
                }
              );
            }
          }
        }
      );

      // Transform the grouped transactions into the desired format
      const groupedResult = Object.keys(groupedEscrowTransactions).map(
        (escrowAccount) => groupedEscrowTransactions[escrowAccount]
      );

      const transactionsMerge = [
        ...groupedResult,
        ...normalTransactions.map((t) => [t]),
      ];

      // Step 5: Sort the final result by blocktime
      transactions = transactionsMerge.sort((a, b) => {
        const blocktimeA = a ? a[0].blockTime : a.blockTime;
        const blocktimeB = b ? b[0].blockTime : b.blockTime;

        return blocktimeB - blocktimeA; // Sort by blocktime
      });
    }

    res.send({
      transactions,
    });
  }
}
