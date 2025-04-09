import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { AccountCardController } from './account-card.controller';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Account } from '../account/entities/account.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Card, Account])],
    controllers: [AccountCardController, CardController],
    providers: [CardService],
})
export class CardModule {}
