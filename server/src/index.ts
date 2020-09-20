import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { AppModule } from './app.module';

// Initialize firebase
admin.initializeApp();

const server = express();

export const createNestServer = async expressInstance => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors();
  return app.init();
};

createNestServer(server)
  // tslint:disable-next-line:no-console
  .then(() => console.log('Nest Ready'))
  // tslint:disable-next-line:no-console
  .catch(err => console.error('Nest broken', err));

export const api = functions.https.onRequest(server);
