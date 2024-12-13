import i18next from "../i18n";

import { checkContact } from "../../AppSettings";

import { AppError } from "../../../errors/ErrorHandling";
import { UserSettings } from "../../../database/models/account/UserSettings";

import { transporter } from "./Config";

export async function secondFactor(userId: string, to: string, token: string) {
  const available = await checkContact("emailAddress");
  if (!available) {
    return;
  }

  const userSettings = await UserSettings.findOne({
    where: {
      userId: userId,
    },
    include: {
      association: "language",
    },
  });

  i18next.changeLanguage(userSettings.language.iso);

  const mailOptions = {
    from: "no-reply@xescrow.app",
    to: to,
    subject: i18next.t("authentication.secondFactor.subject"),
    html: `
          <h1>${i18next.t("authentication.secondFactor.header")}</h1>
          <p>${i18next.t("authentication.secondFactor.message")}</p> 
          <p><strong>${token}</strong></p> 
          <p>${i18next.t("authentication.secondFactor.note")}</p> 
          <p>${i18next.t("authentication.secondFactor.contactUs")}</p> 
      `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}

export async function newLogin(userId: string, to: string) {
  const available = await checkContact("emailAddress");
  if (!available) {
    return;
  }

  const userSettings = await UserSettings.findOne({
    where: {
      userId: userId,
    },
    include: {
      association: "language",
    },
  });

  i18next.changeLanguage(userSettings.language.iso);

  const mailOptions = {
    from: "no-reply@xescrow.app",
    to: to,
    subject: i18next.t("authentication.newLogin.subject"),
    html: `
          <h1>${i18next.t("authentication.newLogin.header")}</h1> 
          <p>${i18next.t("authentication.newLogin.message")}</p> 
          <p>${i18next.t("authentication.newLogin.contactUs")}</p>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}
