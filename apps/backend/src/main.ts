import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';

const sessionConfig = {
  name: 'vg-session',
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false, // prevents from forceabily saving
  saveUninitialized: false, // prevent saving sessions that arent initialized
  cookie: {
    secure: false, // true in prod
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600000, // 1 hour
  },
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
} as const;

const corsConfig = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
} as const;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
