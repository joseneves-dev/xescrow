import express, { Request, Response, NextFunction } from 'express';
import passport from '../middlewares/passport/Authorize'; 
import { get } from '../helpers/Redis';

const router = express.Router();

router.get('/authorize', async (req:Request, res:Response, next:NextFunction) => { 
    try {
        req.jwtToken = await get(req.signedCookies.access);
        next();
    } catch (err) {
        next(err);
    }
}, (req:Request, res: Response, next: NextFunction) => {
    passport.authenticate('authorize', { session: false }, (err, data, info) => {
        if (err) { return next(err)  }
        res.send(); 
    })(req, res, next);
});

export default router;