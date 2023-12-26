import { TDepartment } from './department';

export interface CreateUserDTO {
    studentId: string;
    displayName: string;
    userId: string;
}

export interface UpdateUserDTO {
    enableBot?: boolean;
    selectedDepartments?: TDepartment[];
    displayName?: string;
}

export interface IUser extends CreateUserDTO {
    enableBot: boolean;
    selectedDepartments: TDepartment[];
    superuser: boolean;
    authorized: boolean;
}
