import { TDepartment } from './department';

export interface ISlot {
    _id?: string;
    slot: number;
    start: string;
    end: string;
    duration: string;
    department: TDepartment;
    event: string;
    location: string;
    contact: string;
    note: string;
    announced?: boolean;
}
