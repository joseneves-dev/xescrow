import express, {Response, Request, NextFunction } from 'express';
import Identification from '../../../controllers/account/user/Identification'; 

const router = express.Router();

router.get('/identification', (req:Request, res: Response, next: NextFunction) => {
    Identification.personal(req, res, next);
});

export default router;
