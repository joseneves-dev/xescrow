import { Response, Request, NextFunction } from "express";

import { errorHandler } from "../../errors/ErrorHandling";

import { AppLanguages } from "../../database/models/app/AppLanguages";
import { AppTimezones } from "../../database/models/app/AppTimezones";
import { AppCountries } from "../../database/models/app/AppCountries";
import { AppCurrencies } from "../../database/models/app/AppCurrencies";
import { AppBlockchains } from "../../database/models/app/AppBlockchains";

export default class Data {
  static async countries(req: Request, res: Response, next: NextFunction) {
    try {
      const countries = await AppCountries.findAll({
        attributes: ["name", "code"],
      });

      res.send({ countries });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async timezones(req: Request, res: Response, next: NextFunction) {
    try {
      const timezones = await AppTimezones.findAll({
        attributes: ["name", "abbreviation", "offset"],
      });

      res.send({ timezones });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async languages(req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await AppLanguages.findAll({
        attributes: ["name", "iso"],
      });
      res.send({ languages });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async currencies(req: Request, res: Response, next: NextFunction) {
    try {
      const currencies = await AppCurrencies.findAll({
        attributes: ["id", "name", "symbol"],
      });

      res.send({ currencies });
    } catch (error) {
      errorHandler(error, next);
    }
  }

  static async blockchains(req: Request, res: Response, next: NextFunction) {
    try {
      const blockchains = await AppBlockchains.findAll({
        attributes: ["programId", "decimals"],
        include: [
          {
            association: "metaData",
            attributes: ["name", "symbol"],
          },
          {
            association: "tokens",
            attributes: ["mint", "programId", "mintAutority", "decimals"],
            as: "tokens",
            include: {
              association: "metaData",
              attributes: ["name", "symbol"],
            },
          },
        ],
      });

      res.send({ blockchains });
    } catch (error) {
      errorHandler(error, next);
    }
  }
}
