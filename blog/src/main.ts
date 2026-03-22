import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { createEurekaClient } from './eureka/eureka.client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = Number(process.env.PORT ?? 3002);
  await app.listen(port);
  console.log(`Blog service running on port ${port}`);

  const eurekaClient = createEurekaClient({
    appName: process.env.EUREKA_APP_NAME ?? 'blog-service',
    port,
  });

  try {
    await eurekaClient.start();
    console.log('Registered with Eureka');
  } catch (error) {
    console.error('Failed to register with Eureka', error);
  }

  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down...`);
    await app.close();
    await eurekaClient.stop().catch(err => {
      console.error('Failed to deregister from Eureka', err);
    });
    process.exit(0);
  };

  ['SIGINT', 'SIGTERM'].forEach(signal =>
    process.on(signal, () => gracefulShutdown(signal)),
  );
}

bootstrap();
