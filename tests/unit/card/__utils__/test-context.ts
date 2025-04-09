import { CardService } from '@/modules/card/card.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from '@/modules/card/entities/card.entity';
import { Account } from '@/modules/account/entities/account.entity';
import { HashingService } from '@/modules/card/services/hashing-service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

export function setupCardServiceTestContext() {
    let service: CardService;
    let cardRepo: jest.Mocked<Repository<Card>>;
    let accountRepo: jest.Mocked<Repository<Account>>;
    let hashingService: jest.Mocked<HashingService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardService,
                {
                    provide: getRepositoryToken(Card),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Account),
                    useValue: {
                        createQueryBuilder: jest.fn().mockReturnValue({
                            select: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            getExists: jest.fn().mockResolvedValue(true),
                        }),
                    },
                },
                {
                    provide: HashingService,
                    useValue: {
                        hash: jest.fn().mockResolvedValue('hashed1234'),
                        compare: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(CardService);
        cardRepo = module.get(getRepositoryToken(Card));
        accountRepo = module.get(getRepositoryToken(Account));
        hashingService = module.get(HashingService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    return () => ({
        service,
        cardRepo,
        accountRepo,
        hashingService,
    });
}
