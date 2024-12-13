import express from 'express';
import Password from '../../controllers/authentication/Password';
import { forgot, reset} from '../../validators/authentication/Password';
import verifyRecaptcha from '../../middlewares/routes/Recaptcha';

const router = express.Router();

router.post('/forgot-password', verifyRecaptcha, forgot, Password.forgot);
router.post('/reset-password', verifyRecaptcha, reset, Password.reset);

export default router;
