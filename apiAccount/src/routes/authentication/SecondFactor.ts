import express, { Response, Request, NextFunction } from "express";
import passport from "../../middlewares/passport/SecondFactor";
import { verification } from "../../validators/authentication/SecondFactor";
import SecondFactor from "../../controllers/authentication/SecondFactor";
import { get } from "../../helpers/Redis";

import { checkAuthentication } from "../../helpers/AppSettings";
import { AppError, errorHandler } from "../../errors/ErrorHandling";

async function checkSecondFactor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!(await checkAuthentication("secondFactor"))) {
      throw new AppError({
        message: "pages.secondFactor.notAvailable",
        statusCode: 405,
      });
    }
    next();
  } catch (error) {
    errorHandler(error, next);
  }
}

const router = express.Router();

router.use(
  "/secondfactor",
  checkSecondFactor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.jwtToken = await get(req.signedCookies.secondFactor);
      next();
    } catch (err) {
      next(err);
    }
  },
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "secondFactor",
      { session: false },
      (err, data, info) => {
        if (err) {
          return next(err);
        }
        req.session = data.session;
        next();
      }
    )(req, res, next);
  }
);

router.post(
  "/secondfactor/ott",
  verification,
  (req: Request, res: Response, next: NextFunction) => {
    SecondFactor.oneTimeToken(req, res, next);
  }
);

router.post(
  "/secondfactor/otn",
  (req: Request, res: Response, next: NextFunction) => {
    SecondFactor.oneTimeNotification(req, res, next);
  }
);

router.post(
  "/secondfactor",
  (req: Request, res: Response, next: NextFunction) => {
    SecondFactor.request(req, res, next);
  }
);

export default router;
