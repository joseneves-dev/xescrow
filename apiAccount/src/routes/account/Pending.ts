
import express, {Response, Request, NextFunction } from 'express';
import Pending from '../../controllers/account/Pending';

const router = express.Router();

router.get('', (req:Request, res: Response, next: NextFunction) => {
    Pending.get(req, res, next);
});


export default router;
