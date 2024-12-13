import express, { Response, Request, NextFunction } from "express";
import Transactions from "../../../controllers/account/wallet/Transactions";

const router = express.Router();

router.get(
  "/transactions/get",
  (req: Request, res: Response, next: NextFunction) => {
    Transactions.get(req, res, next);
  }
);

export default router;
