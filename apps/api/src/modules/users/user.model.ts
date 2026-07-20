import { Schema, model } from 'mongoose';
const addressSchema = new Schema({ label: String, address: String, detail: String, latitude: Number, longitude: Number, isDefault: Boolean }, { _id: true });
export const User = model('User', new Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, passwordHash: { type: String, required: true }, role: { type: String, enum: ['CUSTOMER', 'OWNER', 'ADMIN'], default: 'CUSTOMER' }, addresses: [addressSchema] }, { timestamps: true }));
