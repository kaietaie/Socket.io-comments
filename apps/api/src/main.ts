import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.use(helmet());
  // app.use(
  //   session({
  //     secret: config.SESSIONSECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //     coockie: { maxAge: 7200000 },
  //   }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
