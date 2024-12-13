
import express, {Response, Request, NextFunction } from 'express';
import Warning from '../../controllers/account/Warning';

const router = express.Router();

router.get('', (req:Request, res: Response, next: NextFunction) => {
    Warning.get(req, res, next);
});

export default router;
