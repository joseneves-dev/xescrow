import bcryptjs from "bcryptjs";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import UAParser from "ua-parser-js";

import { User } from "../../database/models/account/User";
import { AuthSession } from "../../database/models/account/AuthSession";

import { AppError } from "../../errors/ErrorHandling";
import { setStatus } from "../../helpers/authentication/Authentication";

export const loginStrategy = () => {
  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({
            include: [
              {
                association: "emailAddress",
                where: {
                  email: email,
                  active: true,
                },
              },
              {
                association: "auth",
                include: {
                  association: "password",
                  where: {
                    active: true,
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

          const UA = UAParser(req.headers["user-agent"]);

          const createAuthSession = await AuthSession.create(
            {
              authId: user.auth.id,
              data: {
                ua: UA.ua,
                browser: UA.browser,
                engine: UA.engine,
                os: UA.os,
                device: UA.device,
                iv4: req.ipv4,
                ipv6: req.ipv6,
              },
            },
            {
              include: "data",
            }
          );

          if (user.auth.status != "active") {
            return done(new AppError({ message: "authentication.blocked" }));
          }

          const { compareSync } = bcryptjs;
          if (!compareSync(password, user.auth.password.password)) {
            const authSession = await AuthSession.findAll({
              where: {
                authId: user.auth.id,
              },
              order: [["createdAt", "DESC"]],
              limit: 7,
            });

            let attempts = 7;
            for (let i = 0; i < authSession.length; i++) {
              if (authSession[i].success != true) {
                attempts--;
              } else {
                break;
              }
            }

            switch (attempts) {
              case 3:
                return done(
                  new AppError({
                    message: "authentication.three-attemps",
                    statusCode: 401,
                  })
                );
              case 2:
                return done(
                  new AppError({
                    message: "authentication.two-attemps",
                    statusCode: 401,
                  })
                );
              case 1:
                return done(
                  new AppError({
                    message: "authentication.one-attemp",
                    statusCode: 401,
                  })
                );
              case 0:
                await setStatus(user.id, "block");
                return done(
                  new AppError({
                    message: "authentication.block",
                    statusCode: 401,
                  })
                );
              default:
                return done(
                  new AppError({
                    message: "authentication.invalid",
                    statusCode: 401,
                  })
                );
            }
          }

          const data = {
            user: {
              id: user.id,
            },
            session: {
              id: createAuthSession.id,
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
