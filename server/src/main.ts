import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import * as expressEjsLayouts from 'express-ejs-layouts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{cors:true});
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1","2"]
  });
  app.setGlobalPrefix('api');
 
  const config = new DocumentBuilder()
    .setTitle('All Apis')
    .setDescription('The All API description')
    .setVersion('1.0')
    .addTag('shops')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //pipe
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: false
    }   
  ));

  app.useStaticAssets(path.join(__dirname, '..', 'public')); // (optional) Specify a public directory for static assets
  app.setBaseViewsDir(path.join(__dirname, '..', 'views')); // Specify the directory where your views are located
  app.set('view engine', 'ejs');
  app.use(expressEjsLayouts);

  await app.listen(process.env.PORT);
}
bootstrap();