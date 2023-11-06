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
    origin: [`${config.HOST}:${config.PORTCLIENT}`, 'http://localhost:5000'],
    credentials: true,
  });
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
