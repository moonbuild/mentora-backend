import { Request, Response } from 'express';
import argon2 from 'argon2';
import { SignupReq, LoginReq } from '../routes/interface/auth.interface';
import userService from '../service/user.service';
import { createAccessToken, createStoreRefreshToken } from '../utils/auth.util';
import prisma from '../lib/db';
import jwt from 'jsonwebtoken';
import { UserRole } from '../generated/prisma';

const authController = {
  signup: async (req: Request, res: Response) => {
    const { username, password, role, first_name, last_name } = req.body as SignupReq;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });
    if (!role) return res.status(400).json({ error: 'Role is required' });
    if (!first_name) return res.status(400).json({ error: 'First name is required' });
    if (!last_name) return res.status(400).json({ error: 'Last name is required' });

    // only mentor and parent can signup.
    const validRoles = ['mentor', 'parent'];
    if (!validRoles.includes(role))
      return res.status(400).json({ error: `Invalid role, only ${validRoles.join(', ')}` });

    // if username already taken then return
    const user = await userService.findUserByUsername({ username });

    if (user) {
      return res.status(409).json({ error: `Username ${username} already exists` });
    }

    try {
      const hashedPassword = await argon2.hash(password);
      const newUser = await userService.createUser({
        user: {
          username,
          hashed_password: hashedPassword,
          role,
          first_name,
          last_name,
        },
      });
      const accessToken = createAccessToken({ userId: newUser.user_id, role: newUser.role });
      const refreshToken = await createStoreRefreshToken({
        userId: newUser.user_id,
        role: newUser.role,
      });
      return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      console.error('Failed to create new user: ', error);
      return res.status(500).json({ error: 'Failed to create new user' });
    }
  },

  login: async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginReq;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });

    const user = await userService.findUserByUsername({ username });

    if (!user) {
      return res.status(400).json({ error: `User with ${username} does not exist` });
    }

    // now verify passwords
    const isPasswordMatch = await argon2.verify(user.hashed_password, password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: `Incorrect Password` });
    }

    try {
      const accessToken = createAccessToken({ userId: user.user_id, role: user.role });
      const refreshToken = await createStoreRefreshToken({ userId: user.user_id, role: user.role });
      return res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      console.error('Failed to login user: ', error);
      return res.status(500).json({ error: 'Failed to login user' });
    }
  },

  refresh: async (req: Request, res: Response) => {
    // here we check if refresh token is valid
    const oldRefreshToken = req.body.refreshToken;
    if (!oldRefreshToken) return res.status(401).json({ error: 'No refresh token' });

    try {
      const decoded = jwt.verify(oldRefreshToken, process.env['REFRESH_SECRET']!) as {
        userId: string;
        role: UserRole;
      };
      const userId = decoded.userId;
      const role = decoded.role;
      const dbToken = await prisma.refreshToken.findUnique({
        where: { token: oldRefreshToken, is_revoked: false },
      });
      if (!dbToken) {
        res.status(403).json({ error: 'Token is revoked' });
      }
      const accessToken = createAccessToken({ userId: userId, role: role });
      const refreshToken = await createStoreRefreshToken({ userId: userId, role: role });
      return res.status(201).json({ accessToken, refreshToken });
    } catch {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
  },
};
export default authController;
