import express, {Response, Request, NextFunction } from 'express';
import User from '../../../controllers/account/user/User';

const router = express.Router();

router.get('', (req:Request, res: Response, next: NextFunction) => { 
    User.get(req, res, next);
});

export default router;
