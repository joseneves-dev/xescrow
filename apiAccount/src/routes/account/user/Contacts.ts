import express, { Response, Request, NextFunction } from "express";
import EmailAddress from "../../../controllers/account/user/EmailAddress";
import PhoneNumber from "../../../controllers/account/user/PhoneNumber";
import App from "../../../controllers/account/user/App";
import {
  update as updateEmail,
  verification as verificationEmail,
  newVerification as newVerificationEmail,
} from "../../../validators/account/EmailAddress";

import {
  create,
  update as updatePhone,
  verification as verificationPhone,
  newVerification as newVerificationPhone,
  remove,
  newRemove,
} from "../../../validators/account/PhoneNumber";

import { checkContact } from "../../../helpers/AppSettings";
import { AppError, errorHandler } from "../../../errors/ErrorHandling";

async function checkEmailAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!(await checkContact("emailAddress"))) {
      throw new AppError({
        message: "pages.contacts.emailAddress.notAvailable",
        statusCode: 405,
      });
    }
    next();
  } catch (error) {
    errorHandler(error, next);
  }
}

async function checkPhoneNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!(await checkContact("phoneNumber"))) {
      throw new AppError({
        message: "pages.contacts.phoneNumber.notAvailable",
        statusCode: 405,
      });
    }
    next();
  } catch (error) {
    errorHandler(error, next);
  }
}

async function checkApp(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(await checkContact("app"))) {
      throw new AppError({
        message: "pages.contacts.app.notAvailable",
        statusCode: 405,
      });
    }
    next();
  } catch (error) {
    errorHandler(error, next);
  }
}

const router = express.Router();

router.get("/get-email", (req: Request, res: Response, next: NextFunction) => {
  EmailAddress.get(req, res, next);
});

router.post(
  "/update-email",
  checkEmailAddress,
  updateEmail,
  (req: Request, res: Response, next: NextFunction) => {
    EmailAddress.update(req, res, next);
  }
);

router.post(
  "/verification-email",
  checkEmailAddress,
  verificationEmail,
  (req: Request, res: Response, next: NextFunction) => {
    EmailAddress.verification(req, res, next);
  }
);

router.post(
  "/new-verification-email",
  checkEmailAddress,
  newVerificationEmail,
  (req: Request, res: Response, next: NextFunction) => {
    EmailAddress.newVerification(req, res, next);
  }
);

router.get("/get-phone", (req: Request, res: Response, next: NextFunction) => {
  PhoneNumber.get(req, res, next);
});

router.post(
  "/create-phone",
  checkPhoneNumber,
  create,
  (req: Request, res: Response, next: NextFunction) => {
    PhoneNumber.create(req, res, next);
  }
);

router.post(
  "/update-phone",
  checkPhoneNumber,
  updatePhone,
  (req: Request, res: Response, next: NextFunction) => {
    PhoneNumber.update(req, res, next);
  }
);

router.post(
  "/verification-phone",
  checkPhoneNumber,
  verificationPhone,
  (req: Request, res: Response, next: NextFunction) => {
    PhoneNumber.verification(req, res, next);
  }
);

router.post(
  "/new-verification-phone",
  checkPhoneNumber,
  newVerificationPhone,
  (req: Request, res: Response, next: NextFunction) => {
    PhoneNumber.newVerification(req, res, next);
  }
);

router.post(
  "/new-remove-phone",
  checkPhoneNumber,
  newRemove,
  (req: Request, res: Response, next: NextFunction) => {
    PhoneNumber.newRemove(req, res, next);
  }
);

router.post(
  "/remove-phone",
  checkPhoneNumber,
  remove,
  (req: Request, res: Response, next: NextFunction) => {
    PhoneNumber.remove(req, res, next);
  }
);

router.get(
  "/get-app",
  checkApp,
  (req: Request, res: Response, next: NextFunction) => {
    App.get(req, res, next);
  }
);

export default router;
