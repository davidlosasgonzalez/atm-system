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
import { ChangeCardPinDto } from '@/modules/card/dto/change-card-pin.dto';

describe('CardService', () => {
    let service: CardService;
    let cardRepo: jest.Mocked<Repository<Card>>;
    let accountRepo: jest.Mocked<Repository<Account>>;
    let hashingService: jest.Mocked<HashingService>;

    const activateCardDto: ActivateCardDto = {
        pin: '1234',
        repeatedPin: '1234',
    };

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

    it('debería crear y guardar una tarjeta correctamente', async () => {
        const fakeAccount: Account = {
            id: 'account-id',
            iban: 'ES00',
            balance: '0',
            createdAt: new Date(),
        };

        const fakeCard: Card = {
            id: 'card-id',
            accountId: fakeAccount.id,
            account: fakeAccount,
            number: '4111111111111111',
            pin: null,
            isActive: false,
            cardType: 'debit',
            withdrawalLimit: 1000,
            creditLimit: 0,
            createdAt: new Date(),
        };

        cardRepo.create.mockReturnValue(fakeCard);
        cardRepo.save.mockResolvedValue(fakeCard);

        const createCardDto: CreateCardDto = { cardType: 'debit' };

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

        const createCardDto: CreateCardDto = { cardType: 'debit' };

        await expect(
            service.create(createCardDto, 'non-existent-account-id'),
        ).rejects.toThrow(NotFoundException);
    });

    it('debería activar una tarjeta correctamente si está inactiva y sin PIN', async () => {
        const cardId = 'card-id';

        const inactiveCard: Card = {
            id: cardId,
            accountId: 'account-id',
            account: {} as Account,
            number: '4111111111111111',
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
        const cardId = 'card-id';

        cardRepo.findOneBy.mockResolvedValue({
            id: cardId,
            pin: 'already-hashed',
            isActive: true,
        } as Card);

        await expect(service.activate(activateCardDto, cardId)).rejects.toThrow(
            'La tarjeta ya está activa',
        );
    });

    it('debería cambiar correctamente el PIN si todo es válido', async () => {
        const cardId = 'card-id';
        const oldHashedPin = 'hashed-old';
        const newHashedPin = 'hashed-new';

        const card: Card = {
            id: cardId,
            isActive: true,
            pin: oldHashedPin,
        } as Card;

        const changeCardPinDto: ChangeCardPinDto = {
            currentPin: '1234',
            newPin: '5678',
            repeatedNewPin: '5678',
        };

        cardRepo.findOneBy.mockResolvedValue(card);
        hashingService.compare
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);
        hashingService.hash.mockResolvedValue(newHashedPin);

        await service.changeCardPin(changeCardPinDto, cardId);

        expect(hashingService.compare).toHaveBeenCalledWith(
            '5678',
            oldHashedPin,
        );
        expect(hashingService.compare).toHaveBeenCalledWith(
            '1234',
            oldHashedPin,
        );
        expect(hashingService.hash).toHaveBeenCalledWith('5678');
        expect(cardRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({ pin: newHashedPin }),
        );
    });

    it('debería lanzar error si el PIN actual no coincide', async () => {
        const cardId = 'card-id';
        const oldHashedPin = 'hashed-old-pin';

        const card: Card = {
            id: cardId,
            isActive: true,
            pin: oldHashedPin,
        } as Card;

        const dto: ChangeCardPinDto = {
            currentPin: '1234',
            newPin: '5678',
            repeatedNewPin: '5678',
        };

        cardRepo.findOneBy.mockResolvedValue(card);

        hashingService.compare.mockResolvedValueOnce(false);

        await expect(service.changeCardPin(dto, cardId)).rejects.toThrow(
            'El PIN actual es incorrecto',
        );

        expect(hashingService.compare).toHaveBeenCalledWith(
            '5678',
            oldHashedPin,
        );
        expect(hashingService.compare).toHaveBeenCalledWith(
            '1234',
            oldHashedPin,
        );
    });
});
