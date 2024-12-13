import express , {Response, Request, NextFunction } from 'express';
import { subscribe, unsubscribe } from '../validators/Signup';
import Signup from '../controllers/Signup'
import verifyRecaptcha from '../middlewares/Recaptcha';

const router = express.Router();

router.post('/signup/subscribe', subscribe, verifyRecaptcha, async (req:Request, res: Response, next: NextFunction) => { 
  Signup.subscribe(req, res, next) 
});

router.post('/signup/unsubscribe', unsubscribe, verifyRecaptcha, async (req:Request, res: Response, next: NextFunction) => { 
  Signup.unsubscribe(req, res, next) 
});

export default router;
