import { Request, Response, NextFunction } from "express";

import { UserIdentity } from "../../../database/models/account/UserIdentity";
import { UserRole } from "../../../database/models/account/UserRole";

export default class User {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userIdentity = await UserIdentity.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
        include: [
          {
            association: "verification",
          },
          {
            association: "document",
          },
          {
            association: "country",
          },
        ],
        order: [
          ["verification", "createdAt", "DESC"],
          ["document", "createdAt", "DESC"],
        ],
      });

      const userRole = await UserRole.findOne({
        where: {
          userId: req.user.id,
          active: true,
        },
      });

      let role: string;
      if (userRole && userRole.type == "escrow") {
        role = userRole.type;
      }

      const user = {
        role,
        identity: {
          firstName: userIdentity.firstName,
          lastName: userIdentity.lastName,
          country: userIdentity.country.name,
        },
      };

      res.send({
        user,
      });
    } catch (error) {}
  }
}
