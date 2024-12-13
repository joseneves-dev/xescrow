import { Request, Response, NextFunction } from "express";

import { DateTime } from "luxon";
import jwt, { JwtPayload } from "jsonwebtoken";

import { Op } from "@sequelize/core";
import { User } from "../../database/models/account/User";
import { AuthSession } from "../../database/models/account/AuthSession";
import { SessionToken } from "../../database/models/account/SessionToken";
import { AuthTrustedDevice } from "../../database/models/account/AuthTrustedDevice";

import { errorHandler, AppError } from "../../errors/ErrorHandling";

import {
  availableMethods,
  requestMethod,
} from "../../helpers/communications/Communication";

import {
  access,
  refresh,
  secondFactor as secondFactorToken,
} from "../../helpers/Token";

import { get, del } from "../../helpers/Redis";

import {
  secondFactor as emailSecondFactor,
  newLogin,
} from "../../helpers/communications/email/Authentication";

import { checkAuthentication } from "../../helpers/AppSettings";

export default class Authentication {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.user.id;
      const sessionId: string = req.session.id;

      const user = await User.findOne({
        where: {
          id: userId,
        },
        include: {
          association: "emailAddress",
          where: {
            active: true,
          },
        },
      });

      newLogin(user.id, user.emailAddress.email);

      const authSession = await AuthSession.findOne({
        where: {
          id: sessionId,
        },
        include: {
          association: "data",
        },
        order: [["createdAt", "DESC"]],
      });

      let trustedDeviceToken: string,
        isTrusted: boolean = false;

      if (req.signedCookies.trustdevice) {
        trustedDeviceToken = await get(req.signedCookies.trustdevice);
      }

      if (trustedDeviceToken) {
        const { verify } = jwt;

        const decodedToken = verify(
          trustedDeviceToken,
          process.env.CLIENT_TRUSTDEVICE_JWT
        );

        if (
          typeof decodedToken === "object" &&
          decodedToken !== null &&
          "sessionId" in decodedToken
        ) {
          const trustDevice = (decodedToken as JwtPayload).trustDevice;
          const currentDateTime = DateTime.local().toJSDate();

          const TrustedDevice = await AuthTrustedDevice.findOne({
            where: {
              id: trustDevice,
              expires: {
                [Op.gte]: currentDateTime,
              },
              active: true,
            },
          });

          if (
            TrustedDevice &&
            authSession &&
            TrustedDevice.ua === authSession.data.ua &&
            JSON.stringify(TrustedDevice.browser) ===
              JSON.stringify(authSession.data.browser) &&
            JSON.stringify(TrustedDevice.engine) ===
              JSON.stringify(authSession.data.engine) &&
            JSON.stringify(TrustedDevice.os) ===
              JSON.stringify(authSession.data.os) &&
            JSON.stringify(TrustedDevice.device) ===
              JSON.stringify(authSession.data.device) &&
            TrustedDevice.ipv4 === authSession.data.ipv4 &&
            TrustedDevice.ipv6 === authSession.data.ipv6
          ) {
            isTrusted = true;
          }
        } else {
          throw new AppError({ message: "token.invalid", statusCode: 422 });
        }
      }

      const { method } = await requestMethod(null, userId);

      if (
        (await checkAuthentication("secondFactor")) &&
        !isTrusted &&
        Object.keys(method).length !== 0
      ) {
        const { jwtToken, token } = await secondFactorToken(
          sessionId,
          method.type
        );

        if (method.type === "emailAddress") {
          emailSecondFactor(user.id, method.email, token);
        }

        const { methods } = await availableMethods(userId);
        res.cookie("secondFactor", jwtToken, {
          httpOnly: true,
          signed: true,
          domain: process.env.NODE_DOMAIN,
          secure: true,
          sameSite: "lax",
        });

        res.send({
          secondFactor: {
            method,
            methods,
            expires: 600,
          },
        });
      } else {
        authSession.set({
          pending: false,
          success: true,
          active: true,
        });

        await authSession.save();

        const { jwtToken: jwtAccess } = await access(user.id, sessionId);
        const { jwtToken: jwtRefresh } = await refresh(sessionId);
        res.cookie("access", jwtAccess, {
          httpOnly: true,
          signed: true,
          domain: process.env.NODE_DOMAIN,
          secure: true,
          sameSite: "lax",
        });

        res.cookie("refresh", jwtRefresh, {
          httpOnly: true,
          signed: true,
          domain: process.env.NODE_DOMAIN,
          secure: true,
          sameSite: "lax",
        });

        res.send({
          session: { expires: 300 },
        });
      }
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = await get(req.signedCookies.access);

      if (accessToken) {
        const { verify } = jwt;

        const decodedToken = verify(accessToken, process.env.CLIENT_ACCESS_JWT);

        if (
          typeof decodedToken === "object" &&
          decodedToken !== null &&
          "sessionId" in decodedToken
        ) {
          const sessionId = (decodedToken as JwtPayload).sessionId;
          await AuthSession.update(
            { active: false },
            { where: { id: decodedToken.sessionId } }
          );

          await SessionToken.update(
            { active: false },
            {
              where: {
                sessionId: sessionId,
              },
            }
          );
        }
      }

      await del(req.signedCookies.access);
      await del(req.signedCookies.refresh);
      res.cookie("access", "", {
        maxAge: 0,
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });
      res.cookie("refresh", "", {
        maxAge: 0,
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });

      res.status(200).send();
    } catch (error) {
      errorHandler(error, next);
    }
  }
}
