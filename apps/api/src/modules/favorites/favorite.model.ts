import { Schema, model } from 'mongoose';

export const Favorite = model('Favorite', new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true } }, { timestamps: true }));
