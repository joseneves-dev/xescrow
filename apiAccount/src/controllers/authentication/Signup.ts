import { Request, Response, NextFunction } from "express";

import { access, refresh } from "../../helpers/Token";

export default class Signup {
  static async signup(req: Request, res: Response, next: NextFunction) {
    const { jwtToken: jwtAccess } = await access(req.user.id, req.session.id);
    res.cookie("access", jwtAccess, {
      httpOnly: true,
      signed: true,
      domain: process.env.NODE_DOMAIN,
      secure: true,
      sameSite: "lax",
    });

    const { jwtToken: jwtRefresh } = await refresh(req.session.id);
    res.cookie("refresh", jwtRefresh, {
      httpOnly: true,
      signed: true,
      domain: process.env.NODE_DOMAIN,
      secure: true,
      sameSite: "lax",
    });

    res.send({
      message: "page.signup.success",
      session: { expires: 300 },
    });
  }
}
