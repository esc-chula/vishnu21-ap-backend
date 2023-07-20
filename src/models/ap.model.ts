import { TDepartment } from '@/interfaces/department';
import mongoose, { Schema, Document } from 'mongoose';

interface Ap extends Document {
    slot: number;
    start: string;
    end: string;
    duration: string;
    department: TDepartment;
    event: string;
    location: string;
    contact: string;
    note?: string;
    announced?: boolean;
}

const ApSchema: Schema<Ap> = new Schema({
    slot: { type: Number, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    duration: { type: String, required: true },
    department: { type: String, required: true },
    event: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    note: { type: String, required: false },
    announced: { type: Boolean, required: false },
});

const ApModel = mongoose.model<Ap>('Ap', ApSchema);

export default ApModel;
