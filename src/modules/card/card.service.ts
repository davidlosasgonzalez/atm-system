import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { v4 as uuid } from 'uuid';
import { GenCC } from 'creditcard-generator';
import { GenCCFn } from './types/gencc.type';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepo: Repository<Card>,
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
    ) {}

    public async create(
        createCardDto: CreateCardDto,
        accountId: string,
    ): Promise<Card> {
        await this.ensureAccountExists(accountId);

        const [number] = (GenCC as GenCCFn)('VISA', 1);

        const card = this.cardRepo.create({
            id: uuid(),
            accountId,
            number,
            pin: null,
            isActive: false,
            cardType: createCardDto.cardType,
            withdrawalLimit: 1000,
            creditLimit: createCardDto.cardType === 'credit' ? 3000 : 0,
        });

        return this.cardRepo.save(card);
    }

    private async ensureAccountExists(accountId: string): Promise<void> {
        const exists = await this.accountRepo
            .createQueryBuilder()
            .select('1')
            .where('id = :accountId', { accountId })
            .getExists();

        if (!exists) {
            throw new NotFoundException('Cuenta no encontrada');
        }
    }
}
