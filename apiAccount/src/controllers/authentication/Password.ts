import { Response, Request, NextFunction } from "express";

import { randomBytes } from "crypto";
import bcryptjs from "bcryptjs";
import { DateTime } from "luxon";

import { Op } from "@sequelize/core";
import { User } from "../../database/models/account/User";
import { AuthPasswordReset } from "../../database/models/account/AuthPasswordReset";
import { AuthPassword } from "../../database/models/account/AuthPassword";

import { reset, update } from "../../helpers/communications/email/Password";

import { errorHandler, AppError } from "../../errors/ErrorHandling";

export default class Password {
  static async forgot(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({
        include: [
          {
            association: "emailAddress",
            where: {
              email: req.body.email,
              active: true,
            },
          },
          {
            association: "auth",
          },
        ],
      });

      if (!user) {
        throw new AppError({
          message: "pages.forgotPassword.invalid",
          statusCode: 400,
        });
      }

      const token = randomBytes(32).toString("hex");
      const request = randomBytes(16).toString("hex");

      reset(user.id, user.emailAddress.email, token, request);

      await AuthPasswordReset.create({
        authId: user.auth.id,
        token: token,
        request: request,
      });

      res.send({
        message: "pages.forgotPassword.success",
      });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async reset(req: Request, res: Response, next: NextFunction) {
    try {
      const currentDateTime = DateTime.local().toJSDate();

      const authPasswordReset = await AuthPasswordReset.findOne({
        where: {
          request: req.body.request,
          expires: {
            [Op.gte]: currentDateTime,
          },
        },
      });
      const { compareSync } = bcryptjs;

      if (
        !authPasswordReset ||
        !compareSync(req.body.token, authPasswordReset.token)
      ) {
        throw new AppError({
          message: "pages.resetPassword.invalid",
          statusCode: 400,
        });
      }

      const authId = authPasswordReset.authId;

      const authPassword = await AuthPassword.findAll({
        include: {
          association: "auth",
          where: {
            id: authId,
          },
        },
      });

      const activePassword = authPassword.find((password) => password.active);

      const promises = authPassword.map((data) => {
        return compareSync(req.body.newPassword, data.password);
      });

      // Wait for all promises to resolve
      Promise.all(promises)
        .then(async (results) => {
          // Check if any match was found
          if (results.some((result) => result)) {
            throw new AppError({
              message: "password.repeated",
              statusCode: 422,
            });
          }

          if (activePassword) {
            activePassword.active = false;
            activePassword.save();
          }

          await AuthPassword.create({
            authId: authId,
            password: req.body.newPassword,
          });

          authPasswordReset.active = false;
          await authPasswordReset.save();

          const user = await User.findOne({
            include: [
              {
                association: "emailAddress",
              },
              {
                association: "auth",
                where: {
                  id: authId,
                },
              },
            ],
          });

          update(user.id, user.emailAddress.email);

          res.send({
            message: "pages.resetPassword.success",
          });
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const authPassword = await AuthPassword.findAll({
        include: {
          association: "auth",
          where: {
            userId: req.user.id,
          },
        },
      });

      const activePassword = authPassword.find((password) => password.active);

      const { compareSync } = bcryptjs;

      if (!compareSync(req.body.currentPassword, activePassword.password)) {
        throw new AppError({ message: "password.invalid", statusCode: 422 });
      }

      const userId = req.user.id;
      const authId = activePassword.auth.id;

      const promises = authPassword.map((data) => {
        return compareSync(req.body.newPassword, data.password);
      });

      // Wait for all promises to resolve
      Promise.all(promises)
        .then(async (results) => {
          // Check if any match was found
          if (results.some((result) => result)) {
            throw new AppError({
              message: "password.repeated",
              statusCode: 422,
            });
          }

          activePassword.active = false;
          activePassword.save();

          await AuthPassword.create({
            authId: authId,
            password: req.body.newPassword,
          });

          const user = await User.findOne({
            where: {
              id: userId,
            },
            include: {
              association: "emailAddress",
            },
          });

          update(user.id, user.emailAddress.email);

          res.send({
            message: "pages.security.password.updated",
          });
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      errorHandler(error, next);
    }
  }
}
