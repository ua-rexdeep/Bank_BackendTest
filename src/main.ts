import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
      .setTitle('NestNodeJS')
      .setVersion('1.0')
      .addTag('cats <3')
      .addTag('Bank')
      .addTag('Transaction')
      .addTag('Transaction Category')
      .addTag('Webhook')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
