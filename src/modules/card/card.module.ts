import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountCardController } from './account-card.controller';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { HashingService } from './services/hashing-service';
import { Account } from '../account/entities/account.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Card, Account])],
    controllers: [AccountCardController, CardController],
    providers: [CardService, HashingService],
})
export class CardModule {}
