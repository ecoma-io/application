/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PinoLogger, ErrorResponseDTO } from '@ecoma/nestjs';
import { ConfigService } from '@nestjs/config';
import { ApplicationConfig } from './app/config/app.config';
import { BadRequestException, ClassSerializerInterceptor, UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new PinoLogger('Boostrap');
  const app = await NestFactory.create(AppModule, { logger, cors: { origin: '*' } });

  // Add cookie parser middleware
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const logger = new PinoLogger('ValidationPipe.exceptionFactory');

        if (errors.some((error) => Object.keys(error.constraints).some((key) => key === 'whitelistValidation'))) {
          logger.debug({ errors }, 'Have and error with whitelistValidation');
          return new BadRequestException({ message: 'The request data is malformed' });
        } else {
          const response: ErrorResponseDTO<Record<string, string>> = {
            details: errors.reduce((acc, error) => {
              acc[error.property] = Object.values(error.constraints || {})[0];
              return acc;
            }, {} as Record<string, string>),
          };
          return new UnprocessableEntityException(response);
        }
      },
    })
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['_', '$'],
    })
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<ApplicationConfig>('app');
  const port = appConfig.port;

  await app.listen(port);
  logger.log(`Iam server running on ${port}`);
}

bootstrap();
