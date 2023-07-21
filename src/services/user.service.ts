import { TDepartment } from '@/interfaces/department';
import { IUser, UpdateUserDTO } from '@/interfaces/user';
import UserModel from '@/models/user.model';

const createUser = async (user: IUser) => {
    const newUser = await UserModel.create(user)
        .then((user) => user)
        .catch(() => null);
    return newUser;
};

const findAll = async () => {
    const users = await UserModel.find()
        .then((user) => user)
        .catch(() => null);
    return users;
};

const findByUserId = async (userId: string) => {
    const user = await UserModel.findOne({ userId })
        .then((user) => user)
        .catch(() => null);
    return user;
};

const findByStudentId = async (studentId: string) => {
    const user = await UserModel.findOne({ studentId })
        .then((user) => user)
        .catch(() => null);
    return user;
};

const findUserIdBySelectedDepartments = async (
    selectedDepartments: TDepartment[]
) => {
    const userIds = await UserModel.find({
        selectedDepartments: { $in: selectedDepartments },
    })
        .then((users) => users.map((user) => user.userId))
        .catch(() => null);

    return userIds;
};

const updateByUserId = async (userId: string, body: UpdateUserDTO) => {
    const updatedUser = await UserModel.findOneAndUpdate({ userId }, body, {
        new: true,
    })
        .then((user) => user)
        .catch(() => null);

    return updatedUser;
};

const updateByStudentId = async (studentId: string, body: UpdateUserDTO) => {
    const updatedUser = await UserModel.findOneAndUpdate({ studentId }, body, {
        new: true,
    })
        .then((user) => user)
        .catch(() => null);

    return updatedUser;
};

export default {
    createUser,
    findAll,
    findByUserId,
    findByStudentId,
    findUserIdBySelectedDepartments,
    updateByUserId,
    updateByStudentId,
};
