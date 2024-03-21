import { Schema } from 'mongoose';


export enum UserRole {
	ADMIN = 'ADMIN',
	USER = 'USER',
}
export const UserSchema = new Schema({
    fullNmae: { type: String },
    email: { type: String, trim: true, lowercase: true, sparse: true },
    password: { type: String },
    salt: { type: String },
    role: {  type: String, enum: Object.values(UserRole) },
}, {
    timestamps: true
});