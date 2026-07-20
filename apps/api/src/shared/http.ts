import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthRequest = Request & { userId?: string };
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => void fn(req, res, next).catch(next);
export function auth(req: AuthRequest, res: Response, next: NextFunction) { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' }); try { req.userId = (jwt.verify(token, env.jwtSecret) as { sub: string }).sub; next(); } catch { res.status(401).json({ message: '유효하지 않은 인증 정보입니다.' }); } }
