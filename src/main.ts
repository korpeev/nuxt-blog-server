import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT || 3001, () =>
    console.log(`Server started on PORT=${PORT}`),
  );
}
bootstrap();
