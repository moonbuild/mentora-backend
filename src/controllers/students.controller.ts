import { Response } from 'express';
import prisma from '../lib/db';
import { AuthRequest } from '../auth.middleware';
import { SignupReq } from '../routes/interface/auth.interface';
import userService from '../service/user.service';
import argon2 from 'argon2';
import { UserRole } from '../generated/prisma';

const studentsController = {
  createStudent: async (req: AuthRequest, res: Response) => {
    const parentId = req.userId;
    if (!parentId) return res.status(400).json({ error: 'user id is not present' });
    //  we have parent id, make validations on the data sent, check if username already exists.
    // create new studentprofile and link parent with student
    const { username, password, first_name, last_name } = req.body as SignupReq;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });
    if (!first_name) return res.status(400).json({ error: 'First name is required' });
    if (!last_name) return res.status(400).json({ error: 'Last name is required' });

    const role = 'student' as UserRole;
    const hashedPassword = await argon2.hash(password);
    const user = await userService.findUserByUsername({ username });

    if (user) {
      return res.status(409).json({ error: `Username ${username} already exists` });
    }

    // validation done!
    try {
      await prisma.$transaction(async (tx) => {
        const currentUser = {
          username,
          hashed_password: hashedPassword,
          role,
          first_name,
          last_name,
        };
        const studentUser = await userService.createUser({ dbClient: tx, user: currentUser });

        await tx.studentProfile.create({
          data: {
            parent_user_id: parentId,
            student_user_id: studentUser.user_id,
          },
        });
      });
      return res
        .status(201)
        .json({ message: `Student with username ${username} created successfully.` });
    } catch (error) {
      console.error('Failed to create student: ', error);
      return res.status(500).json({ error: 'Failed to create student' });
    }
  },

  getMyStudents: async (req: AuthRequest, res: Response) => {
    const parentId = req.userId;
    if (!parentId) return res.status(400).json({ error: 'user id is not present' });
    // fetch relevant details of all students that are linked to parentid
    try {
      const students = await prisma.studentProfile.findMany({
        where: { parent_user_id: parentId },
        include: {
          student: {
            select: {
              user_id: true,
              username: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });
      return res.status(200).json(students.map((s) => s.student));
    } catch (error) {
      console.error('Error fetching linked students to parents: ', error);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }
  },
};

export default studentsController;
