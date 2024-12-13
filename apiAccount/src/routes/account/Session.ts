
import express, {Response, Request, NextFunction } from 'express';
import Session from '../../controllers/account/Session';

const router = express.Router();

router.get('', (req:Request, res: Response, next: NextFunction) => {
    Session.get(req, res, next);
});

export default router;
