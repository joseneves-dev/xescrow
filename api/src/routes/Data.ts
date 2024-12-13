import express from 'express';

import Data from '../controllers/Data';

const router = express.Router();

router.get('/countries', (req, res, next) => { Data.countries(req, res, next) });
router.get('/languages', (req, res, next) => { Data.languages(req, res, next) });

router.use(async (req, res, next) => {});

export default router;
