import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './modules/account/account.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as 'mysql' | 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
            synchronize: true,
            dropSchema: true,
        }),

        AccountModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
