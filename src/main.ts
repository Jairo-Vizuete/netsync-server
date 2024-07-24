import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as fs from 'fs';
// import * as path from 'path';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(
  //     path.join(__dirname, '../certificates/localhost-key.pem'),
  //   ),
  //   cert: fs.readFileSync(
  //     path.join(__dirname, '../certificates/localhost.pem'),
  //   ),
  // };

  // const app = await NestFactory.create(AppModule, { httpsOptions });

  const app = await NestFactory.create(AppModule);

  // origin: [
  //   'https://889b-186-5-127-22.ngrok-free.app',
  //   'http:localhost:3001',
  //   'http://10.101.48.185:3001',
  // ],
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
