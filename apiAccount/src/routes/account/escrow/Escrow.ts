import express, { Response, Request, NextFunction } from "express";
import Escrow from "../../../controllers/account/escrow/Escrow";
import { checkRole } from "../../../helpers/account/escrow/Escrow";
import { AppError, errorHandler } from "../../../errors/ErrorHandling";

const router = express.Router();

// Middleware that wraps the checkRole function

async function check(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id; // Assuming req.user.id is populated before this middleware runs
    const hasRole = await checkRole(userId, "escrow");
    if (!hasRole) {
      throw new AppError({
        message: "server.not.authorized",
        statusCode: 401,
      });
    }
    next();
  } catch (error) {
    errorHandler(error, next);
  }
}

router.get("", check, (req: Request, res: Response, next: NextFunction) => {
  Escrow.get(req, res, next);
});

router.get(
  "/transactions",
  check,
  (req: Request, res: Response, next: NextFunction) => {
    Escrow.getTxEscrow(req, res, next);
  }
);

export default router;
