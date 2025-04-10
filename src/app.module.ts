import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm/typeorm.config';
import { AccountModule } from './modules/account/account.module';
import { CardModule } from './modules/card/card.module';

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
