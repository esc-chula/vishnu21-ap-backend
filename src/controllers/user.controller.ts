import { CreateUserDTO, UpdateUserDTO } from '@/interfaces/user';
import userService from '@/services/user.service';
import express from 'express';

const router = express.Router();

// create user
router.post('/', async (req, res) => {
    const { displayName, studentId, userId } = req.body as CreateUserDTO;

    const existedUser = await userService.findByStudentId(studentId);

    if (existedUser) {
        return res.status(200).send({
            success: true,
            message: 'User already exists',
            data: existedUser,
        });
    }

    const createdUser = await userService.createUser({
        displayName,
        studentId,
        userId,
        enableBot: false,
        selectedDepartments: [],
        superUser: false,
    });

    if (!createdUser) {
        return res.status(400).send({
            success: false,
            message: 'Error creating user',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'User created successfully',
        data: createdUser,
    });
});

// get all user
router.get('/', async (req, res) => {
    const users = await userService.findAll();

    if (!users) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching users',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'Users fetched successfully',
        data: users,
    });
});

// get by studentId or userId
router.get('/:studentId_or_userId', async (req, res) => {
    const { studentId_or_userId } = req.params;

    const isStudentId = /^653\d{5}21$/.test(studentId_or_userId);

    let user = null;

    if (isStudentId) {
        user = await userService.findByStudentId(studentId_or_userId);
    } else {
        user = await userService.findByUserId(studentId_or_userId);
    }

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching user',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'User fetched successfully',
        data: user,
    });
});

// update user
router.patch('/:studentId_or_userId', async (req, res) => {
    const { studentId_or_userId } = req.params;

    const updateBody = req.body as UpdateUserDTO;

    const isStudentId = /^653\d{5}21$/.test(studentId_or_userId);

    let updatedUser = null;

    if (isStudentId) {
        updatedUser = await userService.updateByStudentId(
            studentId_or_userId,
            updateBody
        );
    } else {
        updatedUser = await userService.updateByUserId(
            studentId_or_userId,
            updateBody
        );
    }

    if (!updatedUser) {
        return res.status(400).send({
            success: false,
            message: 'Error updating user',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
    });
});

export default router;
