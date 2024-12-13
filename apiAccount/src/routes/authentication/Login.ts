import express, { Request, Response, NextFunction } from "express";
import passport from "../../middlewares/passport/Login";
import Authentication from "../../controllers/authentication/Authentication";
import { login } from "../../validators/authentication/Login";
import verifyRecaptcha from "../../middlewares/routes/Recaptcha";

import { checkAuthentication } from "../../helpers/AppSettings";
import { AppError, errorHandler } from "../../errors/ErrorHandling";

const router = express.Router();

async function checkLogin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(await checkAuthentication("login"))) {
      throw new AppError({
        message: "pages.login.notAvailable",
        statusCode: 405,
      });
    }
    next();
  } catch (error) {
    errorHandler(error, next);
  }
}

router.post(
  "/login",
  verifyRecaptcha,
  checkLogin,
  login,
  function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate("login", { session: false }, (err, data, info) => {
      if (err) {
        return next(err);
      }
      req.user = data.user;
      req.session = data.session;
      Authentication.login(req, res, next);
    })(req, res, next);
  }
);

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Authentication.logout(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
