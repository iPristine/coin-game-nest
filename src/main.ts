import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Coin Game API')
    .setDescription('The Coin Game API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'https://4b01-149-50-236-135.ngrok-free.app', // Указывает, с каких источников разрешены запросы
    methods: 'GET,POST,PUT,DELETE', // Указывает, какие методы разрешены
    allowedHeaders: 'Content-Type, Accept', // Указывает, какие заголовки разрешены
    credentials: true, // Указывает, разрешено ли отправлять учетные данные (например, куки)
  });

  await app.listen(3000);
}
bootstrap();
