import type { NextFunction, Request, Response } from 'express';
import { verifyAuthToken } from '../services/authService.js';

export const AUTH_COOKIE_NAME = 'auth_token';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token: unknown = req.cookies?.[AUTH_COOKIE_NAME];

  if (typeof token !== 'string') {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    req.user = { id: payload.userId };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
