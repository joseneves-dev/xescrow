import bcryptjs from "bcryptjs";
import { DateTime } from "luxon";

import { Op } from "@sequelize/core";

import { UserEmailAddress } from "../../../database/models/account/UserEmailAddress";
import { EmailVerification } from "../../../database/models/account/EmailVerification";

import { token as tokenVerification } from "../../communications/email/Verification";
import { convertSeconds } from "../../../utils/Tools";

import { AppError } from "../../../errors/ErrorHandling";

export async function get(userId: string) {
  try {
    const currentDateTime = DateTime.local();

    const userEmailAddress = await UserEmailAddress.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: {
        association: "verification",
        required: false,
        where: {
          expires: {
            [Op.gte]: currentDateTime,
          },
          active: true,
        },
        attributes: ["active", "nextRequest"],
      },
      attributes: ["email", "verified", "active"],
      order: [["verification", "createdAt", "DESC"]],
    });

    const emailAddress = userEmailAddress.get({ plain: true });

    if (userEmailAddress?.verification) {
      let nextRequest = await convertSeconds(
        userEmailAddress.verification.nextRequest
      );

      if (nextRequest < 0) {
        nextRequest = 0;
      }

      emailAddress.verification.nextRequest = nextRequest;
    }

    return { emailAddress };
  } catch (error) {
    throw error;
  }
}

export async function update(userId: string, email: string) {
  try {
    const userEmailAddress = await UserEmailAddress.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: {
        association: "verification",
        attributes: ["id", "active", "nextRequest"],
      },
      attributes: ["id", "email", "verified", "active"],
      order: [["verification", "createdAt", "DESC"]],
    });

    userEmailAddress.active = false;
    await userEmailAddress?.save();

    await UserEmailAddress.create({
      userId: userId,
      email: email,
    });

    const { emailAddress } = await createVerification(userId);

    return { emailAddress };
  } catch (error) {
    throw error;
  }
}

export async function createVerification(userId: string) {
  try {
    const userEmailAddress = await UserEmailAddress.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: [
        {
          association: "verification",
          attributes: ["active", "nextRequest"],
        },
      ],
      attributes: ["id", "email", "verified", "active"],
      order: [["verification", "createdAt", "DESC"]],
    });

    let nextRequestVerification = 0;

    if (userEmailAddress.verification) {
      nextRequestVerification = await convertSeconds(
        userEmailAddress.verification.nextRequest
      );

      if (nextRequestVerification > 0) {
        const emailAddress = userEmailAddress.get({ plain: true });
        emailAddress.verification.nextRequest = nextRequestVerification;
        delete emailAddress.id;

        throw new AppError({
          message: "nextRequest.invalid",
          statusCode: 422,
          emailAddress,
        });
      }
    }

    const token = Math.floor(Math.random() * 900000) + 100000;

    tokenVerification(userId, userEmailAddress.email, token);

    const emailVerification = await EmailVerification.create({
      emailId: userEmailAddress.id,
      token: token.toString(),
    });

    const emailAddress = userEmailAddress.get({ plain: true });
    delete emailAddress.id;

    const { nextRequest, active } = emailVerification.get({ plain: true });
    emailAddress.verification = { nextRequest, active };

    emailAddress.verification.nextRequest = await convertSeconds(
      emailVerification.nextRequest
    );

    return { emailAddress };
  } catch (error) {
    throw error;
  }
}

export async function verification(userId: string, token: string) {
  try {
    const currentDateTime = DateTime.local();

    const userEmailAddress = await UserEmailAddress.findOne({
      where: {
        userId: userId,
        verified: false,
        active: true,
      },
      include: {
        association: "verification",
        where: {
          expires: {
            [Op.gte]: currentDateTime,
          },
          active: true,
        },
        attributes: ["nextRequest", "token"],
      },
      attributes: ["id", "email", "verified", "active"],
      order: [["verification", "createdAt", "DESC"]],
    });
    const { compareSync } = bcryptjs;
    if (
      !userEmailAddress ||
      !compareSync(token, userEmailAddress.verification.token)
    ) {
      throw new AppError({ message: "token.invalid", statusCode: 422 });
    }

    userEmailAddress.verified = true;
    await userEmailAddress.save();

    const emailAddress = userEmailAddress.get({ plain: true });
    delete emailAddress.id;
    delete emailAddress.updatedAt;
    delete emailAddress.verification;

    return { emailAddress };
  } catch (error) {
    throw error;
  }
}
