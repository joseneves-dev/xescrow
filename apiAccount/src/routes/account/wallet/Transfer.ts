import express, { Response, Request, NextFunction } from "express";
import Transafer from "../../../controllers/account/wallet/Transafer";
import { normal, escrow } from "../../../validators/account/wallet/Transfer";

const router = express.Router();

router.post(
  "/transfer/normal",
  normal,
  (req: Request, res: Response, next: NextFunction) => {
    Transafer.normal(req, res, next);
  }
);

router.post(
  "/transfer/escrow",
  escrow,
  (req: Request, res: Response, next: NextFunction) => {
    Transafer.escrow(req, res, next);
  }
);

export default router;
