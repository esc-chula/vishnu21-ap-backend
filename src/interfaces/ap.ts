import { TDepartment } from './department';

export interface ISlot {
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
