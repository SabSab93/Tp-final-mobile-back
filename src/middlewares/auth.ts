// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;         // "Bearer <token>"
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or malformed token" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    req.user = decoded;                             // ≈ { id, email }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};
