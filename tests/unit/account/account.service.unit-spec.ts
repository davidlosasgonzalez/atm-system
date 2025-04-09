import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '@/modules/account/account.service';
import { Account } from '@/modules/account/entities/account.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const fakeAccount = {
    id: 'account-id',
    iban: 'ES00',
    balance: '0',
    createdAt: new Date(),
} satisfies Account;

describe('AccountService', () => {
    let service: AccountService;
    let accountRepo: jest.Mocked<Repository<Account>>;

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

        service = module.get<AccountService>(AccountService);
        accountRepo = module.get(getRepositoryToken(Account));
    });

    it('debería crear y guardar una cuenta correctamente', async () => {
        accountRepo.create.mockReturnValue(fakeAccount);
        accountRepo.save.mockResolvedValue(fakeAccount);

        const result = await service.create();

        expect(accountRepo.create).toHaveBeenCalled();
        expect(accountRepo.save).toHaveBeenCalledWith(fakeAccount);
        expect(result).toEqual(fakeAccount);
    });

    it('debería lanzar un error si falla el guardado', async () => {
        accountRepo.create.mockReturnValue(fakeAccount);
        accountRepo.save.mockRejectedValue(new Error('Error en base de datos'));

        await expect(service.create()).rejects.toThrow(
            'Error en base de datos',
        );
    });
});
