import { Request } from "express";

declare module "express-serve-static-core" {
  export interface Request {
    user?: {
      id: string;
    };
    session?: {
      id: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      jwtToken?: string;
      ipv4?: string;
      ipv6?: string;
    }
  }
}
