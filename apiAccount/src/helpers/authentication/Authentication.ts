import { UserAuth } from "../../database/models/account/UserAuth";

import { AppError } from "../../errors/ErrorHandling";

export async function setStatus(
  userId: string,
  status: "active" | "block" | "close" | "banned" | "suspended"
) {
  // List of allowed status values
  const allowedStatusValues = [
    "active",
    "block",
    "close",
    "banned",
    "suspended",
  ];

  // Check if the provided status is in the allowed list
  if (!allowedStatusValues.includes(status)) {
    throw new AppError({ message: "authentication.invalid.status" });
  }

  const userAuth = await UserAuth.findOne({
    where: {
      userId: userId,
    },
    include: [
      {
        association: "sessions",
        include: {
          association: "tokens",
          where: {
            active: true,
          },
        },
      },
      {
        association: "password",
        where: {
          active: true,
        },
      },
    ],
    order: [["session", "createdAt", "DESC"]],
  });

  if (userAuth) {
    userAuth.status = status;
    userAuth.save();

    if (status === "close" || status === "block") {
      for (const session of userAuth.sessions) {
        for (const token of session.tokens) {
          token.active = false;
          token.save();
        }

        session.active = false;
        session.save();
      }

      userAuth.password.active = false;
      userAuth.password.save();
    }
  }
}
