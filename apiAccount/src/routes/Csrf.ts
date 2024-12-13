import express, {Response, Request, NextFunction } from 'express';
import { doubleCsrf } from "csrf-csrf";

const router = express.Router();

const { generateToken  } =
  doubleCsrf({
    getSecret: () => process.env.COOKIE_CSRF as string,
    cookieName: "x-csrf-token",
    cookieOptions: { 
      sameSite: 'strict', 
      path: "/",
      secure: true,
      signed: true
    },
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  });
router.get('/csrf', async (req:Request, res: Response, next: NextFunction) => { 
  return res.json({
      csrf: generateToken(req, res)
  });
});

export default router;
