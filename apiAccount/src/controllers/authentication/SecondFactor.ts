import { Response, Request, NextFunction } from "express";

import bcryptjs from "bcryptjs";

import { DateTime } from "luxon";

import { Op } from "@sequelize/core";

import { AuthSession } from "../../database/models/account/AuthSession";
import { AuthTrustedDevice } from "../../database/models/account/AuthTrustedDevice";
import { OneTimeToken } from "../../database/models/account/OneTimeToken";
import { OneTimeNotification } from "../../database/models/account/OneTimeNotification";

import { errorHandler, AppError } from "../../errors/ErrorHandling";

import { secondFactor as emailSecondFactor } from "../../helpers/communications/email/Authentication";

import {
  access,
  refresh,
  secondFactor,
  trustDevice,
} from "../../helpers/Token";
import { del } from "../../helpers/Redis";

import { convertSeconds } from "../../utils/Tools";
import { requestMethod } from "../../helpers/communications/Communication";

export default class SecondFactor {
  static async oneTimeToken(req: Request, res: Response, next: NextFunction) {
    try {
      const currentDateTime = DateTime.local();

      const authSession = await AuthSession.findOne({
        where: {
          id: req.session.id,
          active: true,
        },
        include: [
          {
            association: "auth",
          },
          {
            association: "data",
          },
        ],
      });

      if (!authSession) {
        throw new AppError({
          message: "pages.secondFactor.token.error",
          statusCode: 200,
        });
      }

      const oneTimeToken = await OneTimeToken.findOne({
        where: {
          dataId: authSession.id,
          expires: {
            [Op.gte]: currentDateTime,
          },
          active: true,
        },
      });

      const { compareSync } = bcryptjs;

      if (!compareSync(req.body.token, oneTimeToken.token)) {
        throw new AppError({ message: "token.invalid", statusCode: 422 });
      }

      if (req.body.trust_device) {
        const trustedDevice = await AuthTrustedDevice.create({
          authId: authSession.auth.id,
          ua: authSession.data.ua,
          browser: authSession.data.browser,
          engine: authSession.data.engine,
          os: authSession.data.os,
          device: authSession.data.device,
          iv4: authSession.data.ipv4,
          ipv6: authSession.data.ipv6,
        });

        const { jwtToken: jwtTrustdevice } = await trustDevice(
          trustedDevice.id
        );
        res.cookie("trustdevice", jwtTrustdevice, {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          httpOnly: true,
          signed: true,
          domain: process.env.NODE_DOMAIN,
          secure: true,
          sameSite: "lax",
        });
      }

      res.cookie("secondFactor", "", {
        maxAge: 0,
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      oneTimeToken.success = true;
      await oneTimeToken.save();

      authSession.set({
        pending: false,
        success: true,
        active: true,
      });

      await authSession.save();

      const { jwtToken: jwtAccess } = await access(
        authSession.auth.userId,
        authSession.id
      );
      res.cookie("access", jwtAccess, {
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      const { jwtToken: jwtRefresh } = await refresh(authSession.id);
      res.cookie("refresh", jwtRefresh, {
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      const expires = 300;

      res.send({
        session: {
          expires: expires,
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async oneTimeNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authSession = await AuthSession.findOne({
        where: {
          id: req.session.id,
          active: true,
        },
        include: [
          {
            association: "auth",
          },
          {
            association: "data",
          },
        ],
      });

      if (!authSession) {
        throw new AppError({
          message: "pages.secondFactor.notification.error",
          statusCode: 200,
        });
      }

      if (req.body.trust_device) {
        const trustedDevice = await AuthTrustedDevice.create({
          authId: authSession.auth.id,
          ua: authSession.data.ua,
          browser: authSession.data.browser,
          engine: authSession.data.engine,
          os: authSession.data.os,
          device: authSession.data.device,
          iv4: authSession.data.ipv4,
          ipv6: authSession.data.ipv6,
        });

        const { jwtToken: jwtTrustdevice } = await trustDevice(
          trustedDevice.id
        );
        res.cookie("trustdevice", jwtTrustdevice, {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          httpOnly: true,
          signed: true,
          domain: process.env.NODE_DOMAIN,
          secure: true,
          sameSite: "lax",
        });
      }

      await del(req.signedCookies.secondFactor);
      res.cookie("secondFactor", "", {
        maxAge: 0,
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      const currentDateTime = DateTime.local();

      const oneTimeNotification = await OneTimeNotification.findOne({
        where: {
          dataId: authSession.id,
          expires: {
            [Op.gte]: currentDateTime,
          },
          active: true,
        },
        order: [["createdAt", "DESC"]],
      });

      oneTimeNotification.success = true;
      oneTimeNotification.save();

      const { jwtToken: jwtAccess } = await access(
        authSession.auth.userId,
        authSession.id
      );
      res.cookie("access", jwtAccess, {
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      const { jwtToken: jwtRefresh } = await refresh(authSession.id);
      res.cookie("refresh", jwtRefresh, {
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      const expires = 300;
      res.send({
        session: {
          expires: expires,
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async request(req: Request, res: Response, next: NextFunction) {
    try {
      const currentDateTime = DateTime.local();

      const authSession = await AuthSession.findOne({
        where: {
          id: req.session.id,
          active: true,
        },
        include: [
          {
            association: "auth",
          },
          {
            association: "token",
            where: {
              type: "secondFactor",
              expires: {
                [Op.gte]: currentDateTime,
              },
              active: true,
            },
          },
        ],
      });

      if (!authSession) {
        throw new AppError({
          message: "pages.secondFactor.invalid",
          statusCode: 400,
        });
      }

      const oneTimeToken = await OneTimeToken.findOne({
        where: {
          dataId: authSession.id,
          active: true,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      const oneTimeNotification = await OneTimeNotification.findOne({
        where: {
          dataId: authSession.id,
          active: true,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!oneTimeToken && !oneTimeNotification) {
        throw new AppError({
          message: "pages.secondFactor.invalid",
          statusCode: 400,
        });
      }

      let nextRequest: number = 0;

      if (oneTimeNotification) {
        nextRequest = await convertSeconds(oneTimeNotification.nextRequest);
      }

      if (oneTimeToken) {
        nextRequest = await convertSeconds(oneTimeToken.nextRequest);
      }

      if (nextRequest > 0) {
        throw new AppError({ message: "nextRequest.invalid", statusCode: 422 });
      }

      const requestedMethod = req.body.method;
      const userId = authSession.auth.userId;
      const sessionId = authSession.id;

      const { method } = await requestMethod(requestedMethod, userId);

      if (Object.keys(method).length !== 0) {
        throw new AppError({ message: "method.invalid", statusCode: 422 });
      }

      const { jwtToken, token } = await secondFactor(sessionId, method.type);

      let message: string;

      if (method.type == "emailAddress") {
        emailSecondFactor(userId, method.email, token);
        message = "pages.secondFactor.emailAddress.sent";
      } else if (method.type == "phoneNumber") {
        message = "pages.secondFactor.phoneNumber.sent";
      } else if (method.type == "app") {
        message = "pages.secondFactor.app.sent";
      }
      res.cookie("secondFactor", jwtToken, {
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      const expires = convertSeconds(authSession.token.expires);

      res.send({
        message: message,
        secondFactor: {
          method: {
            type: method.type,
            nextRequest: method.nextRequest,
          },
          expires: expires,
        },
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }
}
