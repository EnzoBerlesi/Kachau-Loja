import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://katchauloja.vercel.app',
      'https://katchauloja-mqxlxm9zs-jaumsws-projects.vercel.app',
      'https://katchauloja-jaumsws-projects.vercel.app/',
      'https://katchauloja-jaumsws-projects.vercel.app/',
    ], 
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();

