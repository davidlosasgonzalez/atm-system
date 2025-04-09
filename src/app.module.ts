import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/account.module';
import { CardModule } from './modules/card/card.module';
import { typeOrmConfig } from './config/typeorm/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        AccountModule,
        CardModule,
    ],
})
export class AppModule {}
