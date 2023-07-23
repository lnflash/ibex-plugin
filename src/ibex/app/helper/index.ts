import { Request, Response } from 'express';

export const getToken = (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send("missing authorization header")
  }
  return token;
}


