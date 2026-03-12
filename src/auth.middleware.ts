import { Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthResponse, JwtPayload } from './routes/interface/auth.interface';
import { isValidRole } from './utils/validations.util';

export const authenticate = (req: Request, res: AuthResponse, next: NextFunction) => {
  // check if authorization request is vlaid by checking is token is there and it is sending authorization bearer
  const headerAuth = req.headers.authorization;
  const accessToken = headerAuth?.split(' ')[1];
  if (!headerAuth || !headerAuth.startsWith('Bearer ') || !accessToken) {
    return res.status(401).json({ error: 'Access Denied, you do not have access token' });
  }

  try {
    // first lets verify the token and retrive userId
    const decoded = jwt.verify(accessToken, process.env['ACCESS_TOKEN_SECRET']!) as JwtPayload;
    // if the main payload has empty or undefined values then it is invalid
    if (!decoded.userId || !decoded.role || !isValidRole(decoded.role)) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
    // attach to local bucket which ensures we have proper type safety
    res.locals.userId = decoded.userId;
    res.locals.role = decoded.role;

    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};
