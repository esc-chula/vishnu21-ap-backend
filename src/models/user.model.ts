import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
    studentId: string;
    displayName: string;
    userId: string;
    enableBot: boolean;
    selectedDepartments: string[];
    superuser: boolean;
    isBlocked: boolean;
}

const UserSchema: Schema<User> = new Schema({
    studentId: { type: String, required: true },
    displayName: { type: String, required: true },
    userId: { type: String, required: true },
    enableBot: { type: Boolean, required: true, default: false },
    selectedDepartments: { type: [String], required: true, default: [] },
    superuser: { type: Boolean, required: true, default: true },
    isBlocked: { type: Boolean, required: true, default: true },
});

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
