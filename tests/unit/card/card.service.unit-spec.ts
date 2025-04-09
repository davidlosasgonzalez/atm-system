import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from '@/modules/card/card.service';
import { Repository } from 'typeorm';
import { Card } from '@/modules/card/entities/card.entity';
import { Account } from '@/modules/account/entities/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCardDto } from '@/modules/card/dto/create-card.dto';
import { NotFoundException } from '@nestjs/common';

describe('CardService', () => {
    let service: CardService;
    let cardRepo: jest.Mocked<Repository<Card>>;
    let accountRepo: jest.Mocked<Repository<Account>>;

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
            ],
        }).compile();

        service = module.get<CardService>(CardService);
        cardRepo = module.get(getRepositoryToken(Card));
        accountRepo = module.get(getRepositoryToken(Account));
    });

    it('debería crear y guardar una tarjeta correctamente', async () => {
        const fakeAccount = {
            id: '9586d894-9e6d-4fe7-959d-3889c8b171b1',
            iban: 'ES7620770024003102575766',
            balance: '0',
            createdAt: new Date(),
        } satisfies Account;

        const fakeCard = {
            id: '22f7c4e1-602f-4b88-9845-a47567029aae',
            accountId: fakeAccount.id,
            account: fakeAccount,
            number: '41111111111111111111',
            pin: null,
            isActive: false,
            cardType: 'debit',
            withdrawalLimit: 1000,
            creditLimit: 0,
            createdAt: new Date(),
        } satisfies Card;

        cardRepo.create.mockReturnValue(fakeCard);
        cardRepo.save.mockResolvedValue(fakeCard);

        const createCardDto: CreateCardDto = {
            cardType: 'debit',
        };

        const result = await service.create(createCardDto, fakeAccount.id);

        expect(cardRepo.create).toHaveBeenCalled();
        expect(cardRepo.save).toHaveBeenCalledWith(fakeCard);
        expect(result).toEqual(fakeCard);
    });

    it('debería lanzar NotFoundException si la cuenta no existe', async () => {
        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getExists: jest.fn().mockResolvedValue(false),
        };

        (accountRepo.createQueryBuilder as jest.Mock).mockReturnValue(
            mockQueryBuilder,
        );

        const createCardDto: CreateCardDto = {
            cardType: 'debit',
        };

        await expect(
            service.create(
                createCardDto,
                '6f5925fc-7793-47bb-8690-a2b8e85a9fdc',
            ),
        ).rejects.toThrow(NotFoundException);
    });
});
