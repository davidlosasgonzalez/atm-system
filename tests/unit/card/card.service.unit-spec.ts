import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from '@/modules/card/card.service';
import { Repository } from 'typeorm';
import { Card } from '@/modules/card/entities/card.entity';
import { Account } from '@/modules/account/entities/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCardDto } from '@/modules/card/dto/create-card.dto';
import { NotFoundException } from '@nestjs/common';
import { ActivateCardDto } from '@/modules/card/dto/activate-card.dto';
import { HashingService } from '@/modules/card/services/hashing-service';

const activateCardDto: ActivateCardDto = {
    pin: '1234',
    repeatedPin: '1234',
};

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
                {
                    provide: HashingService,
                    useValue: {
                        hash: jest.fn().mockResolvedValue('hashed1234'),
                        compare: jest.fn(),
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

    it('debería activar una tarjeta correctamente si está inactiva y sin PIN', async () => {
        const cardId = '22f7c4e1-602f-4b88-9845-a47567029aae';

        const inactiveCard: Card = {
            id: cardId,
            accountId: '17827f21-6d3a-4d54-9a28-06810eae84b6',
            account: {} as Account,
            number: '41111111111111111111',
            pin: null,
            isActive: false,
            cardType: 'debit',
            withdrawalLimit: 1000,
            creditLimit: 0,
            createdAt: new Date(),
        };

        cardRepo.findOneBy.mockResolvedValue(inactiveCard);
        cardRepo.save.mockResolvedValue({
            ...inactiveCard,
            isActive: true,
            pin: 'hashed1234',
        });

        await service.activate(activateCardDto, cardId);

        expect(cardRepo.findOneBy).toHaveBeenCalledWith({ id: cardId });
        expect(cardRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
                isActive: true,
                pin: 'hashed1234',
            }),
        );
    });

    it('debería lanzar error si la tarjeta ya está activa', async () => {
        const cardId = 'a0d1e7b8-e3e8-48e3-a2eb-6c0cd02e87c6';

        cardRepo.findOneBy.mockResolvedValue({
            id: cardId,
            pin: '1234',
            isActive: true,
        } as Card);

        await expect(service.activate(activateCardDto, cardId)).rejects.toThrow(
            'La tarjeta ya está activa',
        );
    });
});
