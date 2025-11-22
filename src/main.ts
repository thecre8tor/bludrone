import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, HttpException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new ConsoleLogger() });

  // Enable global exception filter for consistent error formatting
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        // Format validation errors to match our error pattern
        const messages = errors
          .map((error) => {
            const constraints = error.constraints || {};
            return Object.values(constraints).join('; ');
          })
          .join('; ');

        return new HttpException(
          {
            status: 'fail',
            error: {
              code: 'VALIDATION_ERROR',
              message: messages || 'Validation failed',
            },
          },
          400,
        );
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📋 Health check: http://localhost:${port}/api/v1/health`);
  console.log(`📦 Drone endpoints: http://localhost:${port}/api/v1/drones`);
  console.log(`💊 Medication endpoints: http://localhost:${port}/api/v1/medications`);
}

bootstrap();
