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
    const {userId: parentId} = res.locals;
    if (!parentId) return res.status(400).json({ error: 'user id is not present' });
    //  we have parent id, three steps
    // step1  make validations on the data sent, check if username already exists.
    // step2 create new studentprofile 
    // step3 link parent with student
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
      // using transaction as i dont want one operation to succeed while the other fails
      await prisma.$transaction(async (tx) => {
        const currentUser:CreateUserDTO = {
          username,
          hashed_password: hashedPassword,
          role,
          first_name,
          last_name,
        };
        const studentUser = await userService.createUser({ dbClient: tx, user: currentUser });

        await studentProfileService.createStudentProfile({dbClient:tx, parentId, studentId:studentUser.user_id}) 
        
      });
      return res
        .status(201)
        .json({ message: `Student with username ${username} created successfully.` });
    } catch (error) {
      console.error('Failed to create student: ', error);
      return res.status(500).json({ error: 'Failed to create student' });
    }
  },

  getMyStudents: async (req: Request, res: AuthResponse) => {
    const parentId = res.locals.userId;
    if (!parentId) return res.status(400).json({ error: 'user id is not present' });
    try {
      const students = await studentProfileService.findStudents({parentId});
      return res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching linked students to parents: ', error);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }
  },
};

export default studentsController;
