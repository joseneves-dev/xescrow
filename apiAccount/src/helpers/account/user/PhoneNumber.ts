import bcryptjs from "bcryptjs";
import { DateTime } from "luxon";

import { Op } from "@sequelize/core";

import { UserPhoneNumber } from "../../../database/models/account/UserPhoneNumber";
import { PhoneVerification } from "../../../database/models/account/PhoneVerification";
import { PhoneRemove } from "../../../database/models/account/PhoneRemove";
import { AppCountries } from "../../../database/models/app/AppCountries";

import { convertSeconds } from "../../../utils/Tools";

import { AppError } from "../../../errors/ErrorHandling";

export async function get(userId: string) {
  try {
    const currentDateTime = DateTime.local();

    const userPhoneNumber = await UserPhoneNumber.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: [
        {
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
        {
          association: "remove",
          required: false,
          where: {
            expires: {
              [Op.gte]: currentDateTime,
            },
            active: true,
          },
          attributes: ["active", "nextRequest"],
        },
        {
          association: "country",
          attributes: ["name", "iso", "code"],
          required: true,
        },
      ],
      attributes: ["number", "verified", "active"],
      order: [
        ["verification", "createdAt", "DESC"],
        ["remove", "createdAt", "DESC"],
      ],
    });
    let phoneNumber = undefined;
    if (userPhoneNumber) {
      phoneNumber = userPhoneNumber.get({ plain: true });

      if (userPhoneNumber?.verification || userPhoneNumber?.remove) {
        let nextRequestVerification = 0,
          nextRequestRemove = 0;

        if (userPhoneNumber?.verification) {
          nextRequestVerification = await convertSeconds(
            userPhoneNumber.verification.nextRequest
          );

          if (nextRequestVerification < 0) {
            nextRequestVerification = 0;
          }

          phoneNumber.verification.nextRequest = nextRequestVerification;
        }

        if (userPhoneNumber?.remove) {
          nextRequestRemove = await convertSeconds(
            userPhoneNumber.remove.nextRequest
          );

          if (nextRequestRemove < 0) {
            nextRequestRemove = 0;
          }

          phoneNumber.remove.nextRequest = nextRequestRemove;
        }
      }
    }

    return { phoneNumber };
  } catch (error) {
    throw error;
  }
}

export async function create(userId: string, number: number, code: string) {
  try {
    const countries = await AppCountries.findOne({ where: { code: code } });

    if (!countries) {
      throw new AppError({ message: "country.invalid", statusCode: 422 });
    }

    await UserPhoneNumber.create({
      userId: userId,
      countryId: countries.id,
      number: number,
    });

    const { phoneNumber } = await createVerification(userId);

    return { phoneNumber };
  } catch (error) {
    throw error;
  }
}

export async function update(userId: string, number: number, code: string) {
  try {
    const countries = await AppCountries.findOne({ where: { code: code } });

    if (!countries) {
      throw new AppError({
        message: "phoneNumber.country.invalid",
        statusCode: 422,
      });
    }

    const userPhoneNumber = await UserPhoneNumber.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: [
        {
          association: "verification",
        },
        {
          association: "remove",
        },
      ],
      order: [
        ["verification", "createdAt", "DESC"],
        ["remove", "createdAt", "DESC"],
      ],
    });

    userPhoneNumber.active = false;
    userPhoneNumber.save();

    await UserPhoneNumber.create({
      userId: userId,
      countryId: countries.id,
      number: number,
    });

    const { phoneNumber } = await createVerification(userId);

    return { phoneNumber };
  } catch (error) {
    throw error;
  }
}

export async function createVerification(userId: string) {
  try {
    const userPhoneNumber = await UserPhoneNumber.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: [
        {
          association: "verification",
          attributes: ["active", "nextRequest"],
        },
        {
          association: "country",
          attributes: ["name", "iso", "code"],
          required: true,
        },
      ],
      attributes: ["id", "number", "verified", "active"],
      order: [["verification", "createdAt", "DESC"]],
    });

    let nextRequestVerification = 0;

    if (userPhoneNumber.verification) {
      nextRequestVerification = await convertSeconds(
        userPhoneNumber.verification.nextRequest
      );

      if (nextRequestVerification > 0) {
        const phoneNumber = userPhoneNumber.get({ plain: true });
        delete phoneNumber.id;

        throw new AppError({
          message: "nextRequest.invalid",
          statusCode: 422,
          phoneNumber,
        });
      }
    }

    const token = Math.floor(Math.random() * 900000) + 100000;
    const phoneNumber = {
      countryCode: userPhoneNumber.country.code,
      number: userPhoneNumber.number,
    };

    //MISS SEND TOKEN VERIFICATION

    const phoneVerification = await PhoneVerification.create({
      phoneId: userPhoneNumber.id,
      token: token.toString(),
    });

    const plainUserPhoneNumber = userPhoneNumber.get({ plain: true });
    delete plainUserPhoneNumber.id;

    const { nextRequest, active } = phoneVerification.get({ plain: true });
    plainUserPhoneNumber.verification = { nextRequest, active };

    plainUserPhoneNumber.verification.nextRequest = await convertSeconds(
      phoneVerification.nextRequest
    );

    return { phoneNumber };
  } catch (error) {
    throw error;
  }
}

export async function verification(userId: string, token: string) {
  try {
    const currentDateTime = DateTime.local();

    const userPhoneNumber = await UserPhoneNumber.findOne({
      where: {
        userId: userId,
        verified: false,
        active: true,
      },
      include: [
        {
          association: "verification",
          where: {
            expires: {
              [Op.gte]: currentDateTime,
            },
            active: true,
          },
          attributes: ["nextRequest", "token"],
        },
        {
          association: "country",
          attributes: ["name", "iso", "code"],
          required: true,
        },
      ],
      attributes: ["id", "number", "verified", "active"],
      order: [["verification", "createdAt", "DESC"]],
    });

    const { compareSync } = bcryptjs;

    if (
      !userPhoneNumber ||
      !compareSync(token, userPhoneNumber.verification.token)
    ) {
      throw new AppError({ message: "token.invalid", statusCode: 422 });
    }

    userPhoneNumber.verified = true;
    await userPhoneNumber.save();

    const phoneNumber = userPhoneNumber.get({ plain: true });
    delete phoneNumber.id;
    delete phoneNumber.updatedAt;
    delete phoneNumber.verification;

    return { phoneNumber };
  } catch (error) {
    throw error;
  }
}

export async function createRemove(userId: string) {
  try {
    const userPhoneNumber = await UserPhoneNumber.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: [
        {
          association: "remove",
          attributes: ["active", "nextRequest"],
        },
        {
          association: "country",
          attributes: ["name", "iso", "code"],
        },
      ],
      attributes: ["id", "number", "verified", "active"],
      order: [["remove", "createdAt", "DESC"]],
    });

    let nextRequestRemove = 0;

    if (userPhoneNumber.remove) {
      nextRequestRemove = await convertSeconds(
        userPhoneNumber.remove.nextRequest
      );
      if (nextRequestRemove > 0) {
        const phoneNumber = userPhoneNumber.get({ plain: true });
        delete phoneNumber.id;
        throw new AppError({
          message: "nextRequest.invalid",
          statusCode: 422,
          data: { phoneNumber },
        });
      }
    }

    const token = Math.floor(Math.random() * 900000) + 100000;
    const phoneNumber = {
      countryCode: userPhoneNumber?.country.code,
      number: userPhoneNumber.number,
    };

    //MISS SEND TOKEN VERIFICATION

    const phoneRemove = await PhoneRemove.create({
      phoneId: userPhoneNumber.id,
      token: token.toString(),
    });

    const plainUserPhoneNumber = userPhoneNumber.get({ plain: true });
    delete plainUserPhoneNumber.id;

    const { nextRequest, active } = phoneRemove.get({ plain: true });
    plainUserPhoneNumber.remove = { nextRequest, active };

    plainUserPhoneNumber.remove.nextRequest = await convertSeconds(
      phoneRemove.nextRequest
    );

    return { phoneNumber };
  } catch (error) {
    throw error;
  }
}

export async function remove(userId: string, token: string) {
  try {
    const currentDateTime = DateTime.local();

    const userPhoneNumber = await UserPhoneNumber.findOne({
      where: {
        userId: userId,
        active: true,
      },
      include: [
        {
          association: "remove",
          required: false,
          where: {
            expires: {
              [Op.gte]: currentDateTime,
            },
            active: true,
          },
          attributes: ["nextRequest", "token"],
        },
        {
          association: "country",
          attributes: ["name", "iso", "code"],
        },
      ],
      attributes: ["id", "number", "verified", "active"],
      order: [["remove", "createdAt", "DESC"]],
    });

    if (!userPhoneNumber) {
      throw new AppError({ message: "phoneNumber.invalid", statusCode: 422 });
    }

    if (userPhoneNumber?.verified) {
      const { compareSync } = bcryptjs;

      if (
        !userPhoneNumber.remove ||
        !compareSync(token, userPhoneNumber.remove.token)
      ) {
        throw new AppError({ message: "token.invalid", statusCode: 422 });
      }
    }

    userPhoneNumber.active = false;
    await userPhoneNumber.save();

    return { phoneNumber: undefined };
  } catch (error) {
    throw error;
  }
}
