import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { auth } from './firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret_key';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    console.error('No authorization header');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authorizationHeader.split('Bearer ')[1];

  if (!token) {
    console.error('No token found in authorization header');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as { uid: string };
    console.log('Decoded Token:', decodedToken);
    const user = await auth.getUser(decodedToken.uid);
    (req as any).user = {
      uid: user.uid,
      name: user.displayName ?? user.email,
      email: user.email,
    };
    next();
  } catch (error) {
    console.error('Token verification failed', error);
    return res.status(401).json({
      message: 'Unauthorized: Invalid token',
      error: (error as Error).message,
    });
  }
};
