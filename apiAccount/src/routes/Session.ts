import express, { Request, Response, NextFunction } from "express";
import passport from "../middlewares/passport/Refresh";
import { access } from "../helpers/Token";
import { get } from "../helpers/Redis";

const router = express.Router();

router.post(
  "/session/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.jwtToken = await get(req.signedCookies.refresh);
      next();
    } catch (err) {
      next(err);
    }
  },
  function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "refresh",
      { session: false },
      async (err, data, info) => {
        if (err) {
          return next(err);
        }
        const user = data.user;
        const session = data.session;

        const { jwtToken } = await access(user.id, session.id);
        res.cookie("access", jwtToken, {
          httpOnly: true,
          signed: true,
          domain: process.env.NODE_DOMAIN,
          secure: true,
          sameSite: "lax",
        });

        res.send({
          session: {
            expires: 300,
          },
        });
      }
    )(req, res, next);
  }
);

export default router;
