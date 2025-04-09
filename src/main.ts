import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { GlobalExceptionsFilter } from '@/shared/pipes/global-exceptions.filter';
import { customValidationPipe } from '@/shared/pipes/custom-validation.pipe';
import * as morgan from 'morgan';
import { env } from '@/config/env/env.config';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionsFilter());
    app.useGlobalPipes(customValidationPipe);
    app.use(morgan('dev'));

    await app.listen(env.PORT);

    console.log(
        `Servidor en funcionamiento en http://localhost:${env.PORT ?? 3001}`,
    );
}

void bootstrap();
