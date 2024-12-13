import express, {Response, Request, NextFunction } from 'express';
import Settings from '../../../controllers/account/user/Settings'; 
import { update } from '../../../validators/account/Settings';

const router = express.Router();

router.get('/settings', (req:Request, res: Response, next: NextFunction) => { 
    Settings.get(req, res, next);
});

router.post('/update-settings', update, (req:Request, res: Response, next: NextFunction) => { 
    Settings.update(req, res, next);
});

export default router;
