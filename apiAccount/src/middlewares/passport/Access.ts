import { Request } from "express";
import passport from "passport";
import { Strategy as JWTstrategy } from "passport-jwt";
import bcryptjs from "bcryptjs";
import { DateTime } from "luxon";

import { Op } from "@sequelize/core";
import { User } from "../../database/models/account/User";

import { AppError } from "../../errors/ErrorHandling";

const JwtToken = function (req: Request) {
  if (req && req.jwtToken && req.jwtToken != null) {
    const token = req.jwtToken;
    return token;
  } else {
    throw new AppError({
      message: "authentication.notLoggedIn",
      statusCode: 401,
    });
  }
};

export const accessStrategy = () => {
  passport.use(
    "access",
    new JWTstrategy(
      {
        secretOrKey: process.env.CLIENT_ACCESS_JWT,
        jwtFromRequest: JwtToken,
      },
      async (payload, done) => {
        try {
          if (!payload.userId || !payload.sessionToken) {
            return done(
              new AppError({
                message: "server.payload.invalid",
                statusCode: 401,
              })
            );
          }

          const currentDateTime = DateTime.local().toJSDate();

          const user = await User.findOne({
            where: {
              id: payload.userId,
            },
            include: [
              {
                association: "auth",
                required: true,
                include: {
                  association: "session",
                  where: {
                    id: payload.sessionId,
                    active: true,
                    success: true,
                  },
                  include: {
                    association: "token",
                    where: {
                      type: "access",
                      expires: {
                        [Op.gte]: currentDateTime,
                      },
                      active: true,
                    },
                  },
                },
              },
            ],
          });

          if (!user) {
            return done(
              new AppError({
                message: "authentication.invalid",
                statusCode: 401,
              })
            );
          }

          if (user.auth.status != "active") {
            return done(
              new AppError({
                message: "authentication.blocked",
                statusCode: 401,
              })
            );
          }

          const { compareSync } = bcryptjs;

          if (
            !compareSync(payload.sessionToken, user.auth.session.token.token)
          ) {
            return done(
              new AppError({ message: "token.invalid", statusCode: 401 })
            );
          }

          const data = {
            user: {
              id: user.id,
            },
          };

          return done(null, data);
        } catch (error) {
          return done(new AppError());
        }
      }
    )
  );
};

export default passport;
