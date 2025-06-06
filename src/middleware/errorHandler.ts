import { Request, Response, NextFunction } from 'express';

interface AppError {
  status: number;
  message: string;
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message });
};

export default errorHandler;
