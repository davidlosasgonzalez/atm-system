import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { IBAN, CountryCode } from 'ibankit';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
    ) {}

    public async create(): Promise<Account> {
        const account = this.accountRepo.create({
            id: uuid(),
            iban: IBAN.random(CountryCode.ES).toString(),
            balance: '0',
        });

        return this.accountRepo.save(account);
    }
}
