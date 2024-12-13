import i18next from "../i18n";

import { AppError } from "../../../errors/ErrorHandling";
import { UserSettings } from "../../../database/models/account/UserSettings";

import { transporter } from "./Config";
import { checkContact } from "../../AppSettings";

export async function token(
  userId: string,
  to: string,
  token: string | number
) {
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
    subject: i18next.t("emailAddress.verification.subject"),
    html: `
          <h1>${i18next.t("emailAddress.verification.header")}</h1> 
          <p>${i18next.t("emailAddress.verification.message")}</p> 
          <p><strong>${token}</strong></p> 
          <p>${i18next.t("emailAddress.verification.note")}</p>
          <p>${i18next.t("emailAddress.verification.contactUs")}</p>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}
