import { Schema, model } from 'mongoose';

export const AuditLog = model('AuditLog', new Schema({ actorId: { type: Schema.Types.ObjectId, ref: 'User' }, action: { type: String, required: true, index: true }, targetType: String, targetId: String, metadata: Schema.Types.Mixed, ip: String }, { timestamps: true }));
