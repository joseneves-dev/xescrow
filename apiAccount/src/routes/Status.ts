import express , {Response, Request, NextFunction } from 'express';

const router = express.Router();

router.get('/healthcheck', async (req:Request, res: Response, next: NextFunction) => { 
  return res.json('OK');
});

export default router;
