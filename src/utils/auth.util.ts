import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from './constants';
import prisma from '../lib/db';

export const createAccessToken = ({ userId }: { userId: string }) => {
  return jwt.sign({ userId, jti: crypto.randomUUID() }, process.env['ACCESS_TOKEN_SECRET']!, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
};

export const createStoreRefreshToken = async ({ userId }: { userId: string }) => {
  const token = jwt.sign({ userId, jti: crypto.randomUUID() }, process.env['REFRESH_SECRET']!, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

  // we need to ensure both operations succeed, we dont want one to succeed and other to fail
  await prisma.$transaction([
    prisma.refreshToken.updateMany({
      where: {
        fk_user_id: userId,
        is_revoked: false,
      },
      data: {
        is_revoked: true,
      },
    }),
    prisma.refreshToken.create({
      data: {
        fk_user_id: userId,
        token: token,
      },
    }),
  ]);

  return token;
};
