import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BN from "bn.js";

const splToken = require("@solana/spl-token");
const { TOKEN_2022_PROGRAM_ID } = splToken;

import { AppBlockchainRpc } from "../../database/models/app/AppBlockchainRpc";

import { ESCROW_ACCOUNT_DATA_LAYOUT } from "../../utils/solana/Layout";

import { AppError } from "../../errors/ErrorHandling";
import { AppBlockchainPrograms } from "../../database/models/app/AppBlockchainPrograms";

export async function rpc() {
  const blockchainRPCs = await AppBlockchainRpc.findOne({
    where: { active: true },
  });

  const endpoint = blockchainRPCs.endpoint;

  const connection = new Connection(endpoint, { commitment: "finalized" });

  return connection;
}

export async function feePayerKeypair() {
  const keypair = process.env.SOLANA_FEE_PAYER_KEYPAIR;

  const keypairArray = keypair.split(",").map(Number);

  const secretKey = Keypair.fromSecretKey(Uint8Array.from(keypairArray));

  return secretKey;
}

export async function escrowAgentKeypair() {
  const keypair = process.env.SOLANA_ESCROW_AGENT_KEYPAIR;

  const keypairArray = keypair.split(",").map(Number);

  const secretKey = Keypair.fromSecretKey(Uint8Array.from(keypairArray));

  return secretKey;
}

export async function verifySecretKey(
  checkPublicKey: string,
  checkSecretKey: string
) {
  try {
    const publicKey = new PublicKey(checkPublicKey);
    const secretKey = new Uint8Array(Buffer.from(checkSecretKey, "base64"));
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

    return keypair.publicKey === publicKey;
  } catch (error) {
    throw new AppError({ message: "secretKey.invalid", statusCode: 422 });
  }
}

export async function sendTx(serializedTxBuffer, fromSecretKey = null) {
  const connection = await rpc();

  // Deserialize the buffer back to a Transaction object
  const tx = Transaction.from(Buffer.from(serializedTxBuffer, "base64"));
  if (fromSecretKey) {
    try {
      const fromKeypair = Keypair.fromSecretKey(
        Buffer.from(fromSecretKey, "hex")
      );
      tx.partialSign(fromKeypair);
    } catch (error) {
      return;
    }
  }

  const feePayer = await feePayerKeypair();
  tx.partialSign(feePayer);

  // Send the transaction to the Solana network
  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
  });

  return { signature: signature };
}

export async function sendTxEscrow(
  serializedTxBuffer,
  fromSecretKey = null,
  initialize: boolean = false
) {
  const connection = await rpc();
  try {
    // Deserialize the buffer back to a Transaction object
    const tx = Transaction.from(Buffer.from(serializedTxBuffer, "base64"));
    if (fromSecretKey) {
      try {
        const fromKeypair = Keypair.fromSecretKey(
          Buffer.from(fromSecretKey, "hex")
        );
        tx.partialSign(fromKeypair);
      } catch (error) {
        return;
      }
    }
    const feePayer = await feePayerKeypair();
    tx.partialSign(feePayer);

    if (initialize) {
      const escrowAgent = await escrowAgentKeypair();
      tx.partialSign(escrowAgent);
    }

    // Send the transaction to the Solana network
    const signature = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: true,
    });

    return { signature: signature };
  } catch (error) {
    throw error;
  }
}

export async function getSignature(publicKey, lastSignature = undefined) {
  const connection = await rpc();

  const PubKey = new PublicKey(publicKey);

  const getSignature = await connection.getSignaturesForAddress(PubKey, {
    limit: 20,
    until: lastSignature,
  });

  const signature = getSignature.map((signature) => ({
    blockTime: signature.blockTime,
    confirmationStatus: signature.confirmationStatus,
    memo: signature.memo,
    signature: signature.signature,
    slot: signature.slot,
    err: signature.err ? true : false,
    publicKey,
  }));

  return { signature };
}
interface signature {
  blockTime: number;
  confirmationStatus: string;
  memo: null | string;
  signature: string;
  slot: number;
  err: boolean;
  publicKey: string;
}

export async function getTxAccount(signature: signature) {
  const connection = await rpc();

  const SYSTEM_PROGRAM_ID = SystemProgram.programId;

  const getTransaction = await connection.getTransaction(signature.signature, {
    maxSupportedTransactionVersion: 0,
  });

  const instructions = getTransaction.transaction.message.compiledInstructions;
  const accountKeys = getTransaction.transaction.message.getAccountKeys();

  for (const instruction of instructions) {
    const programId = accountKeys.get(instruction.programIdIndex).toBase58();

    // Check if it's a SOL transfer (System Program) && intruction.data is 0x02 indicates a SOL transfer
    if (
      programId === SystemProgram.programId.toBase58() &&
      instruction.data[0] === 0x02
    ) {
      // Get sender and receiver accounts
      const sender = accountKeys
        .get(instruction.accountKeyIndexes[0])
        .toBase58();
      const receiver = accountKeys
        .get(instruction.accountKeyIndexes[1])
        .toBase58();

      const amount =
        (getTransaction.meta.postBalances[instruction.accountKeyIndexes[1]] -
          getTransaction.meta.preBalances[instruction.accountKeyIndexes[1]]) /
        LAMPORTS_PER_SOL;

      const fee = getTransaction.meta.fee / LAMPORTS_PER_SOL;

      return {
        programId: SYSTEM_PROGRAM_ID.toBase58(),
        instruction: "normal",
        status: "confirmed",
        sender: sender,
        receiver: receiver,
        amount: amount,
        fee: fee,
      };
    }
  }
  return null; // If no transaction is found or doesn't meet criteria
}

export async function getTxTokenAccount(signature: signature) {
  const connection = await rpc();

  const appBlockchainPrograms = await AppBlockchainPrograms.findOne({
    where: {
      active: true,
    },
    include: {
      association: "blockchain",
      include: {
        association: "metaData",
        where: {
          name: "Solana",
        },
      },
    },
  });
  const ESCROW_PROGRAM_ID = appBlockchainPrograms.programId;

  const getTransaction = await connection.getTransaction(signature.signature, {
    maxSupportedTransactionVersion: 0,
  });

  const instructions = getTransaction.transaction.message.compiledInstructions;
  const accountKeys = getTransaction.transaction.message.getAccountKeys();
  for (const instruction of instructions) {
    const programId = accountKeys.get(instruction.programIdIndex).toBase58();
    if (programId == TOKEN_2022_PROGRAM_ID.toBase58()) {
      // Extract sender and receiver accounts
      const senderTokenAccount = accountKeys
        .get(instruction.accountKeyIndexes[0])
        .toBase58();
      const receiverTokenAccount = accountKeys
        .get(instruction.accountKeyIndexes[1])
        .toBase58();

      const senderAccountInfo = await connection.getParsedAccountInfo(
        new PublicKey(senderTokenAccount)
      );
      const receiverAccountInfo = await connection.getParsedAccountInfo(
        new PublicKey(receiverTokenAccount)
      );

      const sender = senderAccountInfo.value.data["parsed"]["info"].owner;

      const receiver = receiverAccountInfo.value.data["parsed"]["info"].owner;

      const decimals =
        getTransaction.meta.postTokenBalances[0].uiTokenAmount["decimals"];
      const postBalance =
        getTransaction.meta.postTokenBalances[0].uiTokenAmount["amount"];
      const preBalance =
        getTransaction.meta.preTokenBalances[0].uiTokenAmount["amount"];

      const rawAmount = Math.abs(Number(postBalance) - Number(preBalance));
      const amount = rawAmount / Number(Math.pow(10, decimals));

      const mint = getTransaction.meta.postTokenBalances[0]?.mint;

      const fee = getTransaction.meta.fee / LAMPORTS_PER_SOL;

      return {
        programId: TOKEN_2022_PROGRAM_ID.toBase58(),
        instruction: "normal",
        status: "confirmed",
        mint: mint.toString(),
        sender: sender,
        receiver: receiver,
        amount: amount.toString(),
        fee: fee,
      };
    }

    if (programId == ESCROW_PROGRAM_ID) {
      let dataAccount;
      if (instruction.data[0] == 1) {
        //Initialize transaction
        const [
          from,
          fromAccount,
          to,
          toAccount,
          escrowAccountAutoritys,
          escrowAutority,
          data,
          escrowAccount,
          programId,
          mint,
        ] = instruction.accountKeyIndexes;

        dataAccount = data;
      } else if (instruction.data[0] == 2) {
        //Confirm transation
        const [from, data, escrowAccount, toAccount, programId, mint] =
          instruction.accountKeyIndexes;
        dataAccount = data;
      } else if (instruction.data[0] == 3) {
        //Cancel transaction
        const [from, data, escrowAccount, toAccount, programId, mint] =
          instruction.accountKeyIndexes;
        dataAccount = data;
      } else if (instruction.data[0] == 4) {
        //Start dispute
        const [from, data] = instruction.accountKeyIndexes;
        dataAccount = data;
      } else if (instruction.data[0] == 5) {
        //End Dispute
        const [from, data] = instruction.accountKeyIndexes;
        dataAccount = data;
      } else {
      }

      if (dataAccount) {
        const dataPubKey = accountKeys.get(dataAccount);
        const encodedState = await connection.getAccountInfo(dataPubKey);

        if (encodedState) {
          const decodedState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(
            encodedState.data
          );

          const fee = getTransaction.meta.fee / LAMPORTS_PER_SOL;
          const sender = new PublicKey(decodedState.FromPubkey).toBase58();
          const receiver = new PublicKey(decodedState.ToPubkey).toBase58();
          const data = new PublicKey(decodedState.DataPubkey).toBase58();
          const escrowAccount = new PublicKey(
            decodedState.AccountPubkey
          ).toBase58();

          const escrowAutority = new PublicKey(
            decodedState.AutorityPubkey
          ).toBase58();

          const tokenMint = new PublicKey(
            decodedState.TokenProgramMint
          ).toBase58();

          const decimals =
            getTransaction.meta.postTokenBalances[0].uiTokenAmount["decimals"];
          const postBalance =
            getTransaction.meta.postTokenBalances[0].uiTokenAmount["amount"];
          const preBalance =
            getTransaction.meta.preTokenBalances[0].uiTokenAmount["amount"];

          const rawAmount = Math.abs(Number(postBalance) - Number(preBalance));
          const amount = rawAmount / Number(Math.pow(10, decimals));

          let status = "";

          if (decodedState.Confirm == 1) {
            status = "confirmed";
          } else if (decodedState.Cancel == 1) {
            status = "cancelled";
          } else if (decodedState.Dispute == 1) {
            status = "disputed";
          } else {
            status = "initialized";
          }

          return {
            programId: ESCROW_PROGRAM_ID,
            instruction: "escrow",
            mint: tokenMint,
            sender: sender,
            receiver: receiver,
            data: data,
            escrowAccount: escrowAccount,
            escrowAutority: escrowAutority,
            status: status,
            amount: amount,
            fee: fee,
          };
        }
      }
    }
  }
}

export async function getTxEscrowAccount(signature: signature) {
  const connection = await rpc();

  const appBlockchainPrograms = await AppBlockchainPrograms.findOne({
    where: {
      active: true,
    },
    include: {
      association: "blockchain",
      include: {
        association: "metaData",
        where: {
          name: "Solana",
        },
      },
    },
  });
  const ESCROW_PROGRAM_ID = appBlockchainPrograms.programId;

  const getTransaction = await connection.getTransaction(signature.signature, {
    maxSupportedTransactionVersion: 0,
  });

  const instructions = getTransaction.transaction.message.compiledInstructions;
  const accountKeys = getTransaction.transaction.message.getAccountKeys();
  for (const instruction of instructions) {
    const programId = accountKeys.get(instruction.programIdIndex).toBase58();
    if (programId == ESCROW_PROGRAM_ID) {
      let dataAccount;
      if (instruction.data[0] == 1) {
        //Initialize transaction
        const [
          from,
          fromAccount,
          to,
          toAccount,
          escrowAccountAutoritys,
          escrowAutority,
          data,
          escrowAccount,
          programId,
          mint,
        ] = instruction.accountKeyIndexes;

        dataAccount = data;
      } else if (instruction.data[0] == 2) {
        //Confirm transation
        const [from, data, escrowAccount, toAccount, programId, mint] =
          instruction.accountKeyIndexes;
        dataAccount = data;
      } else if (instruction.data[0] == 3) {
        //Cancel transaction
        const [from, data, escrowAccount, toAccount, programId, mint] =
          instruction.accountKeyIndexes;
        dataAccount = data;
      } else if (instruction.data[0] == 4) {
        //Start dispute
        const [from, data] = instruction.accountKeyIndexes;
        dataAccount = data;
      } else if (instruction.data[0] == 5) {
        //End Dispute
        const [from, data] = instruction.accountKeyIndexes;
        dataAccount = data;
      } else {
      }

      if (dataAccount) {
        const dataPubKey = accountKeys.get(dataAccount);
        const encodedState = await connection.getAccountInfo(dataPubKey);
        if (encodedState) {
          const decodedState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(
            encodedState.data
          );
          const fee = getTransaction.meta.fee / LAMPORTS_PER_SOL;
          const sender = new PublicKey(decodedState.FromPubkey).toBase58();
          const receiver = new PublicKey(decodedState.ToPubkey).toBase58();
          const data = new PublicKey(decodedState.DataPubkey).toBase58();

          const escrowAccount = new PublicKey(decodedState.AccountPubkey);

          const escrowAutority = new PublicKey(
            decodedState.AutorityPubkey
          ).toBase58();

          const tokenMint = new PublicKey(
            decodedState.TokenProgramMint
          ).toBase58();

          const mintAccountInfo = await connection.getParsedAccountInfo(
            escrowAccount
          );
          let decimals = 0;
          if (mintAccountInfo.value) {
            const mintData = mintAccountInfo.value.data;

            // Check if the data is parsed and has the "parsed" field
            if ("parsed" in mintData) {
              decimals = mintData.parsed.info.tokenAmount.decimals;
            }
          }
          const rawAmount = new BN(decodedState.Amount, 10, "le").toNumber();
          const amount = rawAmount / Number(Math.pow(10, decimals));

          let status = "";

          if (decodedState.Confirm == 1) {
            status = "confirmed";
          } else if (decodedState.Cancel == 1) {
            status = "cancelled";
          } else if (decodedState.Dispute == 1) {
            status = "disputed";
          } else {
            status = "initialized";
          }

          return {
            programId: ESCROW_PROGRAM_ID,
            instruction: "escrow",
            mint: tokenMint,
            sender: sender,
            receiver: receiver,
            data: data,
            escrowAccount: escrowAccount.toBase58(),
            escrowAutority: escrowAutority,
            status: status,
            amount: amount,
            fee: fee,
          };
        }
      }
    }
  }
}
