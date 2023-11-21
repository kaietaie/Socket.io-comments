import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [`${config.HOST }:${config.PORTCLIENT}` , `${config.HOST}:${config.PORT}`,],
    credentials: true,
  });
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
    }, 
    },
  }));
  await app.listen(config.PORT);
}
bootstrap();

