import express, { Request, Response, NextFunction } from "express";
import passport from "../middlewares/passport/Access";
import { get } from "../helpers/Redis";

import IdentificationRouter from "./account/user/Identification";
import UserRouter from "./account/user/User";
import EscrowRouter from "./account/escrow/Escrow";
import WalletRouter from "./account/wallet/Wallet";
import WalletTransferRouter from "./account/wallet/Transfer";
import WalletTransactionsRouter from "./account/wallet/Transactions";
import WalletSettingsRouter from "./account/wallet/Settings";
import ContactsRouter from "./account/user/Contacts";
import SecurityRouter from "./account/user/Security";
import uSettingsRouter from "./account/user/Settings";
import NotificationsRouter from "./account/user/Notifications";
import SessionRouter from "./account/Session";
import WarningRouter from "./account/Warning";
import PendingRouter from "./account/Pending";

const router = express.Router();

router.use(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.jwtToken = await get(req.signedCookies.access);
      next();
    } catch (err) {
      next(err);
    }
  },
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("access", { session: false }, (err, data, info) => {
      if (err) {
        return next(err);
      }
      req.user = data.user;
      next();
    })(req, res, next);
  }
);

router.use(
  "/user",
  IdentificationRouter,
  UserRouter,
  ContactsRouter,
  SecurityRouter,
  uSettingsRouter,
  NotificationsRouter
);

router.use("/escrow", EscrowRouter);

router.use(
  "/wallet",
  WalletRouter,
  WalletTransferRouter,
  WalletTransactionsRouter,
  WalletSettingsRouter
);
router.use("/pending", PendingRouter);
router.use("/warning", WarningRouter);
router.use("/session", SessionRouter);

export default router;
