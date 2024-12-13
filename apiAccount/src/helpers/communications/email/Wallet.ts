import i18next from "../i18n";

import { AppError } from "../../../errors/ErrorHandling";
import { UserSettings } from "../../../database/models/account/UserSettings";

import { transporter } from "./Config";

export async function viewSecretKey(userId: string, to: string, token: string) {
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
    subject: i18next.t("wallet.secretKey.subject"),
    html: `
          <h1>${i18next.t("wallet.secretKey.header")}</h1>
          <p>${i18next.t("wallet.secretKey.message")}</p> 
          <p><strong>${token}</strong></p> 
          <p>${i18next.t("wallet.secretKey.note")}</p> 
          <p>${i18next.t("wallet.secretKey.contactUs")}</p> 
      `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}

export async function removeSecretKey(
  userId: string,
  to: string,
  token: string
) {
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
    subject: i18next.t("wallet.secretKey.subject"),
    html: `
          <h1>${i18next.t("wallet.secretKey.header")}</h1>
          <p>${i18next.t("wallet.secretKey.message")}</p> 
          <p><strong>${token}</strong></p> 
          <p>${i18next.t("wallet.secretKey.note")}</p> 
          <p>${i18next.t("wallet.secretKey.contactUs")}</p> 
      `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}
