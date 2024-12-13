import express, { Response, Request, NextFunction } from "express";
import Data from "../controllers/app/Data";
import Settings from "../controllers/app/Settings";

const router = express.Router();

router.get("/countries", (req: Request, res: Response, next: NextFunction) => {
  Data.countries(req, res, next);
});
router.get("/timezones", (req: Request, res: Response, next: NextFunction) => {
  Data.timezones(req, res, next);
});
router.get("/languages", (req: Request, res: Response, next: NextFunction) => {
  Data.languages(req, res, next);
});
router.get("/settings", (req: Request, res: Response, next: NextFunction) => {
  Settings.get(req, res, next);
});
router.get("/currencies", (req: Request, res: Response, next: NextFunction) => {
  Data.currencies(req, res, next);
});
router.get(
  "/blockchains",
  (req: Request, res: Response, next: NextFunction) => {
    Data.blockchains(req, res, next);
  }
);

router.use(async (req, res, next) => {});

export default router;
