import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // check if authorization request is vlaid by checking is token is there and it is sending authorization bearer
  const headerAuth = req.headers.authorization;
  const accessToken = headerAuth?.split(' ')[1];
  if (!headerAuth || !headerAuth.startsWith('Bearer ') || !accessToken) {
    return res.status(400).json({ error: 'Access Denied, you do not have access token' });
  }

  try {
    // first lets verify the token and retrive userId
    const decoded = jwt.verify(accessToken, process.env['ACCESS_TOKEN_SECRET']!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};
