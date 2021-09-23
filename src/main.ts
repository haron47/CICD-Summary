import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {AppModule} from './app.module';
import * as cookieSession from 'cookie-session';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.init();

  app.use(
    cookieSession({
      name: 'session',
      keys: ['key1', 'key2'],
    }),
  );

  app.use(cookieParser());

  console.log('testing CI');
  console.log('testing s3 업로드');
  console.log('code deploy');
  await app.listen(3000);
}
bootstrap();
