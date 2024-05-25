import { NextFunction, Request, Response } from 'express';
import { auth } from './firebaseAdmin';

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
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Decoded Token:', decodedToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed', error);
    return res
      .status(401)
      .json({
        message: 'Unauthorized: Invalid token',
        error: (error as Error).message,
      });
  }
};
