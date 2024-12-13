import {
  SystemProgram,
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  Keypair,
} from "@solana/web3.js";

import {
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

import { Buffer } from "buffer";
import { BN } from "bn.js";

import { ESCROW_ACCOUNT_DATA_LAYOUT } from "/@src/utils/wallet/util/layout";

const connection = new Connection(
  clusterApiUrl(import.meta.env.VITE_SOLANA_CLUSTER),
);

const payer = new PublicKey(import.meta.env.VITE_SOLANA_FEE_PAYER_PUBKEY);
const escrowAutority = new PublicKey(
  import.meta.env.VITE_SOLANA_ESCROW_AUTORITY_PUBKEY,
);
const escrowAccountAutoritys = new PublicKey(
  import.meta.env.VITE_SOLANA_ESCROW_ACCOUNT_AUTORITYS_PUBKEY,
);
const escorwProgramId = new PublicKey(
  import.meta.env.VITE_SOALANA_ESCORW_PROGRAMA_ID,
);

type instructionData = {
  data?: String;
  escrowAccount?: String;
  escrowAutority?: String;
  request?: String;
  receiver?: String;
  amount?: number;
  mint?: String;
  programId?: String;
};

export async function tx(instructionData: instructionData) {
  if (
    !instructionData.request ||
    !instructionData.receiver ||
    !instructionData.amount
  ) {
    return;
  }

  const requestPubKey = new PublicKey(instructionData.request);
  const receiverPubkey = new PublicKey(instructionData.receiver);
  const lamports = Math.floor(instructionData.amount * LAMPORTS_PER_SOL);

  const recentBlockHash = await connection.getLatestBlockhash();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 50_000,
  });

  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
      SystemProgram.transfer({
        fromPubkey: requestPubKey,
        toPubkey: receiverPubkey,
        lamports: lamports,
      }),
    );

  transaction.recentBlockhash = recentBlockHash.blockhash;
  transaction.feePayer = payer;
  const lamportsFee = await transaction.getEstimatedFee(connection);
  const transactionFee = lamportsFee / LAMPORTS_PER_SOL;

  return { tx: transaction, fee: transactionFee };
}

export async function txToken(instructionData: instructionData) {
  if (
    !instructionData.request ||
    !instructionData.receiver ||
    !instructionData.amount ||
    !instructionData.mint
  ) {
    return;
  }
  const mintPubKey = new PublicKey(instructionData.mint);

  const requestPubkey = new PublicKey(instructionData.request);
  const requestAccount = await getAssociatedTokenAddress(
    mintPubKey,
    requestPubkey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );
  const receiverPubkey = new PublicKey(instructionData.receiver);

  const receiverAccount = await getAssociatedTokenAddress(
    mintPubKey,
    receiverPubkey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );

  const recentBlockHash = await connection.getLatestBlockhash();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 50_000,
  });

  const txAmount = instructionData.amount * 1_000_000_000;

  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
      createTransferInstruction(
        requestAccount,
        receiverAccount,
        requestPubkey,
        txAmount,
        [],
        TOKEN_2022_PROGRAM_ID,
      ),
    );

  transaction.recentBlockhash = recentBlockHash.blockhash;
  transaction.feePayer = payer;

  const lamportsFee = await transaction.getEstimatedFee(connection);
  const transactionFee = lamportsFee / LAMPORTS_PER_SOL;

  return { tx: transaction, fee: transactionFee };
}

export async function txTokenInitEscrow(instructionData: instructionData) {
  if (
    !instructionData.request ||
    !instructionData.receiver ||
    !instructionData.amount ||
    !instructionData.mint
  ) {
    return;
  }

  const mintPubKey = new PublicKey(instructionData.mint);

  const requestPubKey = new PublicKey(instructionData.request);
  const requestAccount = await getAssociatedTokenAddress(
    mintPubKey,
    requestPubKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );

  const escrowData = new Keypair();
  // Define your seeds as an array of Uint8Arrays or Buffers
  const seeds = [Buffer.from("escrow"), escrowData.publicKey.toBuffer()]; // You can also use Uint8Array if needed

  // Generate the PDA synchronously
  const [pda, bumpSeed] = PublicKey.findProgramAddressSync(
    seeds,
    escorwProgramId,
  );

  //TO ACCOUNT
  const escrowAccount = await getAssociatedTokenAddress(
    mintPubKey,
    pda,
    true,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );

  const receiverPubkey = new PublicKey(instructionData.receiver);

  const receiverAccount = await getAssociatedTokenAddress(
    mintPubKey,
    receiverPubkey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );

  const txAmount = instructionData.amount * 1_000_000_000;

  const recentBlockHash = await connection.getLatestBlockhash();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 50_000,
  });

  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
      SystemProgram.createAccount({
        space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(
          ESCROW_ACCOUNT_DATA_LAYOUT.span,
          "confirmed",
        ),
        fromPubkey: payer,
        newAccountPubkey: escrowData.publicKey,
        programId: escorwProgramId,
      }),
    )
    .add({
      programId: escorwProgramId,
      keys: [
        { pubkey: requestPubKey, isSigner: true, isWritable: false },
        { pubkey: requestAccount, isSigner: false, isWritable: true },
        { pubkey: receiverPubkey, isSigner: false, isWritable: false },
        { pubkey: receiverAccount, isSigner: false, isWritable: false },
        { pubkey: escrowAccountAutoritys, isSigner: false, isWritable: false },
        { pubkey: escrowAutority, isSigner: true, isWritable: false },
        { pubkey: escrowData.publicKey, isSigner: false, isWritable: true },
        { pubkey: escrowAccount, isSigner: false, isWritable: true },
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: mintPubKey, isSigner: false, isWritable: false },
      ],
      data: Buffer.from(Uint8Array.of(1, ...new BN(txAmount).toArray("le", 8))),
    });

  transaction.recentBlockhash = recentBlockHash.blockhash;
  transaction.feePayer = payer;
  transaction.partialSign(escrowData);
  const lamportsFee = await transaction.getEstimatedFee(connection);
  const transactionFee = lamportsFee / LAMPORTS_PER_SOL;

  return { tx: transaction, escrow: pda.toBase58(), fee: transactionFee };
}

export async function txTokenConfirmEscrow(
  requestPublicKey: String,
  instructionData: instructionData,
) {
  if (
    !instructionData.data ||
    !instructionData.escrowAccount ||
    !requestPublicKey ||
    !instructionData.receiver ||
    !instructionData.mint ||
    !instructionData.programId
  ) {
    console.log(instructionData);
    return;
  }

  const requestPubKey = new PublicKey(requestPublicKey);
  const escrowData = new PublicKey(instructionData.data);
  const escrowAccount = new PublicKey(instructionData.escrowAccount);
  const toPubkey = new PublicKey(instructionData.receiver);
  const mintPubKey = new PublicKey(instructionData.mint);
  const PROGRAM_ID = new PublicKey(instructionData.programId);
  // Define your seeds as an array of Uint8Arrays or Buffers
  const seeds = [Buffer.from("escrow"), escrowData.toBuffer()]; // You can also use Uint8Array if needed

  // Generate the PDA synchronously
  const [pda, bumpSeed] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);

  const toAccount = await getAssociatedTokenAddress(
    mintPubKey,
    toPubkey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );

  const recentBlockHash = await connection.getLatestBlockhash();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 50_000,
  });

  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: requestPubKey, isSigner: true, isWritable: false },
        { pubkey: escrowData, isSigner: false, isWritable: true },
        { pubkey: escrowAccount, isSigner: false, isWritable: true },
        { pubkey: toAccount, isSigner: false, isWritable: true },
        { pubkey: pda, isSigner: false, isWritable: false },
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: mintPubKey, isSigner: false, isWritable: false },
      ],
      data: Buffer.from(Uint8Array.of(2)),
    });

  transaction.recentBlockhash = recentBlockHash.blockhash;
  transaction.feePayer = payer;

  const lamportsFee = await transaction.getEstimatedFee(connection);
  const transactionFee = lamportsFee / LAMPORTS_PER_SOL;

  return { tx: transaction, fee: transactionFee };
}

export async function txTokenCancelEscrow(
  requestPublicKey: String,
  instructionData: instructionData,
) {
  if (
    !instructionData.data ||
    !instructionData.escrowAccount ||
    !instructionData.request ||
    !instructionData.mint ||
    !instructionData.programId
  ) {
    return;
  }
  const requestPubKey = new PublicKey(requestPublicKey);
  const escrowData = new PublicKey(instructionData.data);
  const escrowAccount = new PublicKey(instructionData.escrowAccount);
  const fromPubkey = new PublicKey(instructionData.request);
  const mintPubKey = new PublicKey(instructionData.mint);
  const PROGRAM_ID = new PublicKey(instructionData.programId);
  // Define your seeds as an array of Uint8Arrays or Buffers
  const seeds = [Buffer.from("escrow"), escrowData.toBuffer()]; // You can also use Uint8Array if needed

  // Generate the PDA synchronously
  const [pda, bumpSeed] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);

  const fromAccount = await getAssociatedTokenAddress(
    mintPubKey,
    fromPubkey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );

  const recentBlockHash = await connection.getLatestBlockhash();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 50_000,
  });

  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: requestPubKey, isSigner: true, isWritable: false },
        { pubkey: escrowData, isSigner: false, isWritable: true },
        { pubkey: escrowAccount, isSigner: false, isWritable: true },
        { pubkey: fromAccount, isSigner: false, isWritable: true },
        { pubkey: pda, isSigner: false, isWritable: false },
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: mintPubKey, isSigner: false, isWritable: false },
      ],
      data: Buffer.from(Uint8Array.of(3)),
    });

  transaction.recentBlockhash = recentBlockHash.blockhash;
  transaction.feePayer = payer;

  const lamportsFee = await transaction.getEstimatedFee(connection);
  const transactionFee = lamportsFee / LAMPORTS_PER_SOL;

  return { tx: transaction, fee: transactionFee };
}

export async function txTokenDisputeEscrow(
  requestPublicKey: String,
  instructionData: instructionData,
) {
  if (!instructionData.data || !instructionData.programId) {
    return;
  }

  const requestPubKey = new PublicKey(requestPublicKey);
  const escrowData = new PublicKey(instructionData.data);
  const PROGRAM_ID = new PublicKey(instructionData.programId);

  const recentBlockHash = await connection.getLatestBlockhash();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 50_000,
  });

  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: requestPubKey, isSigner: true, isWritable: false },
        { pubkey: escrowData, isSigner: false, isWritable: true },
      ],
      data: Buffer.from(Uint8Array.of(4)),
    });

  transaction.recentBlockhash = recentBlockHash.blockhash;
  transaction.feePayer = payer;

  const lamportsFee = await transaction.getEstimatedFee(connection);
  const transactionFee = lamportsFee / LAMPORTS_PER_SOL;

  return { tx: transaction, fee: transactionFee };
}

export async function txTokenDisputeActionEscrow(
  requestPublicKey: String,
  instructionData: instructionData,
  receiver: string,
) {
  if (
    !instructionData.data ||
    !receiver ||
    !instructionData.escrowAccount ||
    !instructionData.mint ||
    !instructionData.programId
  ) {
    return;
  }
  const requestPubKey = new PublicKey(requestPublicKey);
  const escrowData = new PublicKey(instructionData.data);
  const escrowAccount = new PublicKey(instructionData.escrowAccount);
  const receiverPubKey = new PublicKey(receiver);
  const PROGRAM_ID = new PublicKey(instructionData.programId);
  const mintPubKey = new PublicKey(instructionData.mint);

  // Define your seeds as an array of Uint8Arrays or Buffers
  const seeds = [Buffer.from("escrow"), escrowData.toBuffer()]; // You can also use Uint8Array if needed

  // Generate the PDA synchronously
  const [pda, bumpSeed] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);

  const receiverAccount = await getAssociatedTokenAddress(
    mintPubKey,
    receiverPubKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
    undefined,
  );

  const recentBlockHash = await connection.getLatestBlockhash();

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 200_000,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 50_000,
  });

  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: requestPubKey, isSigner: true, isWritable: false },
        { pubkey: escrowData, isSigner: false, isWritable: true },
        { pubkey: escrowAccount, isSigner: false, isWritable: true },
        { pubkey: receiverAccount, isSigner: false, isWritable: true },
        { pubkey: pda, isSigner: false, isWritable: false },
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: mintPubKey, isSigner: false, isWritable: false },
      ],
      data: Buffer.from(Uint8Array.of(5)),
    });

  transaction.recentBlockhash = recentBlockHash.blockhash;
  transaction.feePayer = payer;

  const lamportsFee = await transaction.getEstimatedFee(connection);
  const transactionFee = lamportsFee / LAMPORTS_PER_SOL;

  return { tx: transaction, fee: transactionFee };
}
