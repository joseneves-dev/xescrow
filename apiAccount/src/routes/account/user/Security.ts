import express, {Response, Request, NextFunction } from 'express';
import { pendingVerification } from '../../../middlewares/routes/Pending';
import Sessions from '../../../controllers/account/user/Sessions';
import TrustedDevices from '../../../controllers/account/user/TrustedDevices';
import Password from '../../../controllers/authentication/Password';
import { update } from '../../../validators/authentication/Password';

const router = express.Router();

router.get('/get-trusted-devices', (req:Request, res: Response, next: NextFunction) => { 
    TrustedDevices.get(req, res, next);
});

router.post('/remove-trusted-device', pendingVerification, (req:Request, res: Response, next: NextFunction) => { 
    TrustedDevices.remove(req, res, next);
});

router.get('/get-sessions', (req:Request, res: Response, next: NextFunction) => { 
    Sessions.get(req, res, next);
});

router.post('/update-password', pendingVerification, update, (req:Request, res: Response, next: NextFunction) => {
    Password.update(req, res, next);
});

export default router;