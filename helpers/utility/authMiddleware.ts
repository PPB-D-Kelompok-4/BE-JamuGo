import { NextFunction, Request, Response } from 'express';
import { auth } from './firebaseAdmin';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    (req as any).user = await auth.verifyIdToken(token);
    next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
};
