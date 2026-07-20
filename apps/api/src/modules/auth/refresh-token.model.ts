import { Schema, model } from 'mongoose';

export const RefreshToken = model('RefreshToken', new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, tokenId: { type: String, required: true, unique: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, revokedAt: Date, replacedBy: String }, { timestamps: true }));
