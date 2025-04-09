import { setupCardServiceTestContext } from '../__utils__/test-context';
import { CreateCardDto } from '@/modules/card/dto/create-card.dto';
import { Account } from '@/modules/account/entities/account.entity';
import { Card } from '@/modules/card/entities/card.entity';
import { NotFoundException } from '@nestjs/common';

const getCtx = setupCardServiceTestContext();

describe('CardService - create()', () => {
    it('debería crear y guardar una tarjeta correctamente', async () => {
        const { service, cardRepo } = getCtx();

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

        const dto: CreateCardDto = { cardType: 'debit' };
        const result = await service.create(dto, fakeAccount.id);

        expect(cardRepo.create).toHaveBeenCalled();
        expect(cardRepo.save).toHaveBeenCalledWith(fakeCard);
        expect(result).toEqual(fakeCard);
    });

    it('debería lanzar NotFoundException si la cuenta no existe', async () => {
        const { service, accountRepo } = getCtx();

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getExists: jest.fn().mockResolvedValue(false),
        };

        (accountRepo.createQueryBuilder as jest.Mock).mockReturnValue(
            mockQueryBuilder,
        );

        const dto: CreateCardDto = { cardType: 'debit' };

        await expect(service.create(dto, 'non-existent')).rejects.toThrow(
            NotFoundException,
        );
    });
});
