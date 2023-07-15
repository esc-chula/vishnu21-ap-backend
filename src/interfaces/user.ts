export interface CreateUserDTO {
    studentId: string;
    displayName: string;
    userId: string;
}

export interface UpdateUserDTO {
    enableBot?: boolean;
    selectedDepartments?: string[];
}

export interface IUser extends CreateUserDTO {
    enableBot: boolean;
    selectedDepartments: string[];
}
