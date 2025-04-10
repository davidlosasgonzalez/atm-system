import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '@/modules/account/account.controller';
import { AccountService } from '@/modules/account/account.service';
import { Account } from '@/modules/account/entities/account.entity';

export function setupAccountControllerTestContext() {
    let controller: AccountController;
    let accountService: jest.Mocked<AccountService>;

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
            controllers: [AccountController],
            providers: [
                {
                    provide: AccountService,
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get(AccountController);
        accountService = module.get(AccountService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    return () => ({
        controller,
        accountService,
        fakeAccount,
    });
}
