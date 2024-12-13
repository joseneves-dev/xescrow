import express, { Response, Request, NextFunction } from "express";
import Settings from "../../../controllers/account/wallet/Settings";
import {
  requestSecretKey,
  requestRemove,
  secretKey,
} from "../../../validators/account/wallet/Settings";

const router = express.Router();

router.post(
  "/default-account",
  (req: Request, res: Response, next: NextFunction) => {
    Settings.defaultAccount(req, res, next);
  }
);

router.post(
  "/default-currency",
  (req: Request, res: Response, next: NextFunction) => {
    Settings.defaultCurrency(req, res, next);
  }
);

router.post(
  "/request-secret-key",
  requestSecretKey,
  (req: Request, res: Response, next: NextFunction) => {
    Settings.requestSecretKey(req, res, next);
  }
);

router.post(
  "/view-secret-key",
  secretKey,
  (req: Request, res: Response, next: NextFunction) => {
    Settings.viewSecretKey(req, res, next);
  }
);

router.post(
  "/request-remove",
  requestRemove,
  (req: Request, res: Response, next: NextFunction) => {
    Settings.requestRemove(req, res, next);
  }
);

router.post(
  "/remove-secret-key",
  secretKey,
  (req: Request, res: Response, next: NextFunction) => {
    Settings.removeSecretKey(req, res, next);
  }
);

router.post(
  "/remove-address",
  (req: Request, res: Response, next: NextFunction) => {
    Settings.removeAccount(req, res, next);
  }
);

router.post(
  "/rename-address",
  (req: Request, res: Response, next: NextFunction) => {
    Settings.renameAccount(req, res, next);
  }
);

export default router;
