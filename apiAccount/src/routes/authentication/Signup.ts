import express, { Request, Response, NextFunction } from "express";
import passport from "../../middlewares/passport/Signup";
import Signup from "../../controllers/authentication/Signup";
import { signup } from "../../validators/authentication/Signup";

import verifyRecaptcha from "../../middlewares/routes/Recaptcha";

import { checkAuthentication } from "../../helpers/AppSettings";
import { AppError, errorHandler } from "../../errors/ErrorHandling";

async function checkSignup(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(await checkAuthentication("signup"))) {
      throw new AppError({
        message: "pages.signup.notAvailable",
        statusCode: 405,
      });
    }
    next();
  } catch (error) {
    errorHandler(error, next);
  }
}

const router = express.Router();

router.post(
  "/signup",
  verifyRecaptcha,
  checkSignup,
  signup,
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("signup", { session: false }, (err, data, info) => {
      if (err) {
        return next(err);
      }

      req.user = data.user;
      req.session = data.session;

      Signup.signup(req, res, next);
    })(req, res, next);
  }
);

export default router;
