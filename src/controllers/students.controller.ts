import { Request } from 'express';
import prisma from '../lib/db';
import { AuthResponse, SignupReq } from '../routes/interface/auth.interface';
import userService from '../service/user.service';
import argon2 from 'argon2';
import { UserRole } from '../generated/prisma';
import { CreateUserDTO } from '../routes/interface/users.interface';
import studentProfileService from '../service/studentProfile.service';

const studentsController = {
  createStudent: async (req: Request, res: AuthResponse) => {
    const { userId: parentId, role } = res.locals;
    if (role !== 'parent')
      return res.status(403).json({ error: 'Only Parents can create students' });
    //  we have parent id, three steps
    // step1  make validations on the data sent, check if username already exists.
    const { username, password, first_name, last_name } = req.body as SignupReq;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    if (password.length > 64) {
      return res.status(400).json({ error: 'Password is too long (max 64 characters)' });
    }
    if (!first_name) return res.status(400).json({ error: 'First name is required' });
    if (!last_name) return res.status(400).json({ error: 'Last name is required' });

    const studentRole = UserRole.student;

    try {
      const hashedPassword = await argon2.hash(password);
      const user = await userService.findUserByUsername({ username });

      if (user) {
        return res.status(409).json({ error: `Username ${username} already exists` });
      }

      // using transaction as i dont want one operation to succeed while the other fails
      const student = await prisma.$transaction(async (tx) => {
        const currentUser: CreateUserDTO = {
          username,
          hashed_password: hashedPassword,
          role: studentRole,
          first_name,
          last_name,
        };
        // step2 create new student user
        const studentUser = await userService.createUser({ dbClient: tx, user: currentUser });

        // step3 create new studentprofile
        await studentProfileService.createStudentProfile({
          dbClient: tx,
          parentId,
          studentId: studentUser.user_id,
        });
        return studentUser;
      });
      return res.status(201).json(student);
    } catch (error) {
      console.error('Failed to create student: ', error);
      return res.status(500).json({ error: 'Failed to create student' });
    }
  },

  getMyStudents: async (req: Request, res: AuthResponse) => {
    const { userId: parentId, role } = res.locals;
    if (role !== 'parent')
      return res.status(403).json({ error: 'Only Parents can view their students' });
    try {
      const students = await studentProfileService.findStudents({ parentId });
      return res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching linked students to parents: ', error);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }
  },
};

export default studentsController;
