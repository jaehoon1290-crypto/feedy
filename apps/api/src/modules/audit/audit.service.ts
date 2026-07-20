import type { Request } from 'express';
import { AuditLog } from './audit-log.model.js';
export const audit = (req: Request, action: string, actorId?: string, targetType?: string, targetId?: string, metadata?: Record<string, unknown>) => AuditLog.create({ actorId, action, targetType, targetId, metadata, ip: req.ip }).catch(() => undefined);
