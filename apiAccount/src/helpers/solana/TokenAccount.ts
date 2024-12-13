import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

const splToken = require("@solana/spl-token");
const {
  AccountLayout,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} = splToken;

import { rpc, feePayerKeypair } from "./Solana";
import { ESCROW_ACCOUNT_DATA_LAYOUT } from "../../utils/solana/Layout";

import { AppError } from "../../errors/ErrorHandling";

import { AppBlockchainTokens } from "../../database/models/app/AppBlockchainTokens";

async function DECIMALS_TOKEN(mintPubKey: string) {
  const appBlockchainTokens = await AppBlockchainTokens.findOne({
    where: { mint: mintPubKey },
  });

  return BigInt(10 ** appBlockchainTokens.decimals);
}

interface EscrowInfo {
  status: string;
  amount: string;
}

export async function create(mintPublicKey: string, ownerPublicKey: string) {
  try {
    const connection = await rpc();

    const mint = new PublicKey(mintPublicKey);
    const owner = new PublicKey(ownerPublicKey);

    const feePayer = await feePayerKeypair();

    const getOrCreateTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer,
      mint,
      owner,
      false,
      "finalized",
      undefined,
      TOKEN_2022_PROGRAM_ID,
      undefined
    );

    const publicKey = getOrCreateTokenAccount.address.toBase58();

    return { publicKey };
  } catch (error) {
    throw error;
  }
}

interface AccountBalance {
  balance: string;
}

interface Account {
  publicKey?: string;
  balance?: string;
  tokenId?: string;
  state?: "active" | "freze" | "close";
  metaData?: {
    mint: string;
    name: string;
    symbol: string;
  };
}
export async function get(publicKey: string) {
  const connection = await rpc();

  const accountPublicKey = new PublicKey(publicKey);

  // Function to fetch account info with a 5-second delay
  const setDelay = async (): Promise<AccountBalance> => {
    return new Promise<AccountBalance>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const accountInfo = await connection.getAccountInfo(accountPublicKey);
          let balance: string;
          if (!accountInfo) {
            //Thorw
            reject(
              new AppError({ message: "publicKey.invalid", statusCode: 422 })
            );
          }
          const accountInfoDecode = AccountLayout.decode(accountInfo.data);

          const mintPubKey = accountInfoDecode.mint.toBase58();
          const DECIMALS_PER_TOKEN = await DECIMALS_TOKEN(mintPubKey);

          const tokenAmount =
            Number(accountInfoDecode.amount) / Number(DECIMALS_PER_TOKEN);

          balance = tokenAmount.toString();
          resolve({ balance });
        } catch (error) {
          reject(
            new AppError({ message: "pages.wallet.balance", statusCode: 400 })
          );
        }
      }, 1000); // 1 seconds delay
    });
  };

  const { balance } = await setDelay();

  return { publicKey, balance };
}

export async function getByOwner(publicKey: string) {
  const blockchainTokens = await AppBlockchainTokens.findAll({
    include: [
      {
        association: "metaData",
      },
      {
        association: "blockchain",
        include: {
          association: "metaData",
          where: {
            name: "Solana",
          },
        },
      },
    ],
  });

  const connection = await rpc();

  const owner = new PublicKey(publicKey);

  const getTokenAccounts = await connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_2022_PROGRAM_ID,
  });

  let tokenAccounts: Record<string, Account> = {};

  getTokenAccounts.value.forEach((token) => {
    // Inspect the data field to determine the account type
    const publicKey = token.pubkey.toString();
    const data = AccountLayout.decode(token.account.data);
    const mintPublicKey = data.mint.toString();

    //state active = 1 / frozen = 2 / close dosen't show
    let state: "active" | "freze" | "close";
    if (data.state == 1) {
      state = "active";
    } else if (data.state == 2) {
      state = "freze";
    } else {
      state = "close";
    }

    const solanaBlockchainToken = blockchainTokens.find((token) => {
      // Check if the token has a Blockchain association and its MetaData's name is 'Solana'
      return (
        token.blockchain &&
        token.mint == mintPublicKey &&
        token.blockchain.metaData &&
        token.blockchain.metaData.name === "Solana"
      );
    });

    if (solanaBlockchainToken) {
      const amount = data.amount.toString();
      // Add an entry to the accounts object with publicKey as the key
      tokenAccounts[publicKey] = {
        publicKey: publicKey,
        balance: amount,
        tokenId: solanaBlockchainToken.id,
        state: state,
        metaData: {
          mint: solanaBlockchainToken.mint,
          name: solanaBlockchainToken.metaData.name,
          symbol: solanaBlockchainToken.metaData.symbol,
        },
      };
    }
  });

  return { tokenAccounts };
}

export async function createEscrow(mintPublicKey, ownerPublicKey) {
  try {
    const connection = await rpc();

    const mint = new PublicKey(mintPublicKey);
    const owner = new PublicKey(ownerPublicKey);

    const feePayer = await feePayerKeypair();

    const getOrCreateTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer,
      mint,
      owner,
      true,
      undefined,
      "finalized",
      TOKEN_2022_PROGRAM_ID,
      undefined
    );

    const tokenAccountPublicKey = getOrCreateTokenAccount.address.toBase58();

    return { tokenAccountPublicKey };
  } catch (error) {
    throw error;
  }
}

export async function mint(toAccount: string, tokenMint: string) {
  const connection = await rpc();

  const feePayer = await feePayerKeypair();

  const mint = new PublicKey(tokenMint);

  const account = new PublicKey(toAccount);

  const signature = await mintTo(
    connection,
    feePayer,
    mint,
    account,
    feePayer.publicKey,
    20 * 1000000000,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  return { signature };
}

interface AccountStatus {
  status: string;
}

export async function getEscrowAccountInfo(publickey: string) {
  const connection = await rpc();

  const PubKey = new PublicKey(publickey);

  // Function to fetch account info with a 5-second delay
  const setDelay = async (): Promise<AccountStatus> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const encodedState = await connection.getAccountInfo(PubKey);
          const decodedState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(
            encodedState.data
          );

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

          resolve({ status });
        } catch (error) {
          reject(new AppError({ message: "Invalid request" }));
        }
      }, 1000); // 1 seconds delay
    });
  };

  const { status } = await setDelay();

  return { status };
}
