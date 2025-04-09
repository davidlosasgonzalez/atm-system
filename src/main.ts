import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.use(morgan('dev'));

    const port = process.env.PORT;

    await app.listen(process.env.PORT ?? 3001);

    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
}
void bootstrap();
