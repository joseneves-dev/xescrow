import i18next from "../i18n";

import { AppError } from "../../../errors/ErrorHandling";
import { UserSettings } from "../../../database/models/account/UserSettings";

import { transporter } from "./Config";

export async function reset(
  userId: string,
  to: string,
  token: string,
  request: string
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
    subject: i18next.t("password.reset.subject"),
    html: `
          <h1>${i18next.t("password.reset.header")}</h1> 
          <p>${i18next.t("password.reset.message")}</p> 
          <p>${i18next.t("password.reset.note")}</p>
          <a href="https://account.xescrow.app/reset-password/${token}/${request}"><small>${i18next.t(
      "password.reset.reset"
    )}</small></a>
          <p>${i18next.t("password.reset.contactUs")}</p>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}

export async function update(userId: string, to: string) {
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
    subject: i18next.t("password.update.subject"),
    html: `
          <h1>${i18next.t("password.update.header")}</h1> 
          <p>${i18next.t("password.update.contactUs")}</p>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}
