import type { NextFunction, Response } from 'express';
import { User } from '../modules/users/user.model.js';
import type { AuthRequest } from './http.js';

export const requireRole = (...roles: string[]) => async (req: AuthRequest, res: Response, next: NextFunction) => { const user = await User.findById(req.userId).select('role'); if (!user || !roles.includes(user.role)) return res.status(403).json({ message: '권한이 없습니다.' }); next(); };
