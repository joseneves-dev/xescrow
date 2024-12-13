import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UAParser from "ua-parser-js";
import { Op } from "@sequelize/core";

import { User } from "../../database/models/account/User";
import { AppTimezones } from "../../database/models/app/AppTimezones";
import { AppLanguages } from "../../database/models/app/AppLanguages";
import { AppCountries } from "../../database/models/app/AppCountries";

import { welcome } from "../../helpers/communications/email/Signup";

import { token as tokenVerification } from "../../helpers/communications/email/Verification";

import { AppError } from "../../errors/ErrorHandling";
import { AppSettingsAuthentication } from "../../database/models/app/AppSettingsAuthentication";

export const signupStrategy = () => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email", // Specify the field name for username
        passwordField: "password", // Specify the field name for password
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const appSettingsAuthentication =
            await AppSettingsAuthentication.findOne();

          if (appSettingsAuthentication.signup == false) {
            return done(new AppError({ message: "page.signup.invalid" }));
          }

          const UA = UAParser(req.headers["user-agent"]);

          const token = Math.floor(Math.random() * 900000) + 100000;

          const country = await AppCountries.findOne({
            where: { name: { [Op.iLike]: req.body.country } },
          });
          const countryId = country ? country.id : undefined;

          const language = await AppLanguages.findOne({
            where: { iso: { [Op.iLike]: req.body.settings.language } },
          });
          const languageId = language ? language.id : undefined;

          const timezone = await AppTimezones.findOne({
            where: { name: { [Op.iLike]: req.body.settings.timezone } },
          });
          const timezoneId = timezone ? timezone.id : undefined;

          const colorSchema = req.body.settings.colorSchema;

          const appVersion = "1.0.0";
          const mobileAppVersion = "1.0.0";
          const webAppVersion = "1.0.0";

          const user = await User.create(
            {
              auth: {
                password: {
                  password: password,
                },
                session: {
                  pending: false,
                  success: true,
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
              },
              role: {
                type: "user",
              },
              emailAddress: {
                email: email,
                verification: {
                  token: token.toString(),
                },
              },
              identity: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                countryId: countryId,
              },
              settings: {
                languageId,
                timezoneId,
                colorSchema,
                appVersion: appVersion,
                webAppVersion: webAppVersion,
                mobileAppVersion: mobileAppVersion,
              },
              notificationsAccount: {},
              notificationsMarketing: {},
            },
            {
              include: [
                {
                  association: "auth",
                  include: [
                    {
                      association: "password",
                    },
                    {
                      association: "session",
                      include: { association: "data" },
                    },
                  ],
                },
                {
                  association: "role",
                },
                {
                  association: "emailAddress",
                  include: { association: "verification" },
                },
                {
                  association: "identity",
                },
                {
                  association: "settings",
                },
                {
                  association: "notificationsAccount",
                },
                {
                  association: "notificationsMarketing",
                },
              ],
            }
          );

          if (!user) {
            return done(new AppError({ message: "page.signup.invalid" }));
          }

          const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
          };

          welcome(user.id, email, userData);

          tokenVerification(user.id, email, token);

          const data = {
            user: {
              id: user.id,
            },
            session: {
              id: user.auth.session.id,
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
