import express, {Response, Request, NextFunction } from 'express';
import { pendingVerification } from '../../../middlewares/routes/Pending';

import { 
    updateAccount,
    updateMarketing 
} from '../../../validators/account/Notifications'; 


import Notifications from '../../../controllers/account/user/Notifications';

const router = express.Router();

router.get('/notifications', (req:Request, res: Response, next: NextFunction) => { 
    Notifications.get(req, res, next);
});

router.post('/update-notifications-account', pendingVerification, updateAccount, (req:Request, res: Response, next: NextFunction) => { 
    Notifications.updateAccount(req, res, next);
});

router.post('/update-notifications-marketing', pendingVerification, updateMarketing, (req:Request, res: Response, next: NextFunction) => { 
    Notifications.updateMarketing(req, res, next);
});

export default router;
