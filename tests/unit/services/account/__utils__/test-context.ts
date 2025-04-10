import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '@/modules/account/account.service';
import { Account } from '@/modules/account/entities/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export function setupAccountServiceTestContext() {
    let service: AccountService;
    let accountRepo: jest.Mocked<Repository<Account>>;

    const fakeAccount: Account = {
        id: 'account-id',
        iban: 'ES00',
        balance: '0',
        createdAt: new Date(),
        userId: 'user-id',
        user: {
            id: 'user-id',
            firstName: 'Laura',
            lastName: 'Fernández',
            dni: '12345678Z',
            phone: '+34123456789',
            email: 'user@example.com',
            password: 'hashed-password',
            role: 'customer',
            createdAt: new Date(),
            accounts: [],
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                {
                    provide: getRepositoryToken(Account),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(AccountService);
        accountRepo = module.get(getRepositoryToken(Account));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    return () => ({
        service,
        accountRepo,
        fakeAccount,
    });
}
