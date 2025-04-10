import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const method = req.method;
    const headers = req.headers;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} ${url}`);
    console.log('Headers:', headers);
    next();
  }
}
