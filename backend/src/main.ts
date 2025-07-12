import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './common/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use((req: Request, res: Response, next: NextFunction) =>
    new LoggerMiddleware().use(req, res, next),
  );
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();

const corsConfig = {
  origin: ['http://localhost:5173', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
} as const;
