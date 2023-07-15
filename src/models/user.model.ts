import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
    studentId: string;
    displayName: string;
    userId: string;
    enableBot: boolean;
    selectedDepartments: string[];
}

const UserSchema: Schema<User> = new Schema({
    studentId: { type: String, required: true },
    displayName: { type: String, required: true },
    userId: { type: String, required: true },
    enableBot: { type: Boolean, required: true },
    selectedDepartments: { type: [String], required: true },
});

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
