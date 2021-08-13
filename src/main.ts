import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
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
  //app.use(csurf({ cookie: true }));  //正常是這行，但有些API POST時需要略過csrf
  app.use(function (req, res, next) {
    var mw = csurf({ cookie: true });
    console.log(req.url); // check real get url
    console.log(mw);
    if (req.url === '/testpostcsrf') return next(); //pass csrf check
    mw(req, res, next);
  });

  await app.listen(3000);
}
bootstrap();
