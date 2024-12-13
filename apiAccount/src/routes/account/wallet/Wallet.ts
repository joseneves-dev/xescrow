import express, { Response, Request, NextFunction } from "express";
import Wallet from "../../../controllers/account/wallet/Wallet"; // Updated import
import {
  connectWallet,
  importAccount,
  createAccount,
  createTokenAccount,
  saveSecretkey,
} from "../../../validators/account/wallet/Wallet"; // Updated import

const router = express.Router();

router.get("/get", (req: Request, res: Response, next: NextFunction) => {
  Wallet.get(req, res, next);
});

router.get(
  "/get-balance",
  (req: Request, res: Response, next: NextFunction) => {
    Wallet.getBalance(req, res, next);
  }
);

router.post(
  "/create-account",
  createAccount,
  (req: Request, res: Response, next: NextFunction) => {
    Wallet.createAccount(req, res, next);
  }
);

router.post(
  "/create-token-account",
  createTokenAccount,
  (req: Request, res: Response, next: NextFunction) => {
    Wallet.createTokenAccount(req, res, next);
  }
);

router.post(
  "/import",
  importAccount,
  (req: Request, res: Response, next: NextFunction) => {
    Wallet.import(req, res, next);
  }
);

router.post(
  "/connect",
  connectWallet,
  (req: Request, res: Response, next: NextFunction) => {
    Wallet.connect(req, res, next);
  }
);

router.post(
  "/save-secret-key",
  saveSecretkey,
  (req: Request, res: Response, next: NextFunction) => {
    Wallet.saveSecretKey(req, res, next);
  }
);

router.get("/airdrop", (req: Request, res: Response, next: NextFunction) => {
  Wallet.airdrop(req, res, next);
});

export default router;
