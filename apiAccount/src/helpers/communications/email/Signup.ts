import i18next from "../i18n";

import { AppError } from "../../../errors/ErrorHandling";
import { UserSettings } from "../../../database/models/account/UserSettings";
import { checkContact } from "../../AppSettings";

import { transporter } from "./Config";

interface user {
  firstName: string;
  lastName: string;
}

export async function welcome(userId: string, to: string, user: user) {
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
    subject: i18next.t("signup.welcome.subject"),
    html: `
          <h1>${i18next.t("signup.welcome.header")}</h1> 
          <p>${i18next.t("signup.welcome.greeting", {
            name: user.firstName + " " + user.lastName,
          })}</p> 
          <p>${i18next.t("signup.welcome.intro")}</p> 
          <p>${i18next.t("signup.welcome.support")}</p> 
          <p>${i18next.t("signup.welcome.thanks")}</p> 
          <p>${i18next.t("signup.welcome.signature")}</p> 
      `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    throw new AppError();
  }
}
