import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { rpc } from "./Solana";
import { AppError } from "../../errors/ErrorHandling";

export async function create() {
  var keypair = Keypair.generate();

  let publicKey = keypair.publicKey.toString();
  let secretKey = Buffer.from(keypair.secretKey).toString("hex");

  return { publicKey, secretKey };
}

export async function get(publicKey: string) {
  const connection = await rpc();

  const newPublicKey = new PublicKey(publicKey);
  const isValid = PublicKey.isOnCurve(newPublicKey);

  if (!isValid) {
    throw new AppError({ message: "publickey.invalid" });
  }
  let balance: string;
  // Function to fetch balance with a 5-second delay
  const setDelay = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const getBalance = await connection.getBalance(newPublicKey);
          const _balance = Number(getBalance / LAMPORTS_PER_SOL);
          balance = _balance.toString();
          resolve(balance);
        } catch (error) {
          reject(new AppError({ message: "pages.wallet.balance" }));
        }
      }, 1000); // 1 seconds delay
    });
  };

  // Call the function with delay
  await setDelay();

  return { publicKey, balance };
}
