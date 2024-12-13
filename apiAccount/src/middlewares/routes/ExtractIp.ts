import { Request, Response, NextFunction } from "express";

export function extractIp(req: Request, res: Response, next: NextFunction) {
  const forwardedHeader = req.headers["x-forwarded-for"];

  if (forwardedHeader) {
    const forwardedIps = forwardedHeader[0]?.split(",") || [];
    req.ipv4 = forwardedIps[0];

    const forwardedForV6 = req.headers["x-forwarded-for-v6"] as
      | string
      | string[];
    if (Array.isArray(forwardedForV6)) {
      req.ipv6 = forwardedForV6[0] || "";
    } else {
      req.ipv6 = forwardedForV6 || "";
    }
  } else {
    req.ipv4 = req.socket.remoteAddress;
    req.ipv6 = null;
  }

  next();
}
