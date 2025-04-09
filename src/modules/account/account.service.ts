import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { IBAN, CountryCode } from 'ibankit';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
    ) {}

    public async create(): Promise<Account> {
        const account: Account = this.accountRepo.create({
            iban: IBAN.random(CountryCode.ES).toString(),
        });

        return this.accountRepo.save(account);
    }
}
