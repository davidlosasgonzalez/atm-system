import { setupCardServiceTestContext } from '../__utils__/test-context';
import { ActivateCardDto } from '@/modules/card/dto/activate-card.dto';
import { Card } from '@/modules/card/entities/card.entity';
import { Account } from '@/modules/account/entities/account.entity';

const getCtx = setupCardServiceTestContext();

describe('CardService - activate()', () => {
    const dto: ActivateCardDto = {
        pin: '1234',
        repeatedPin: '1234',
    };

    it('debería activar una tarjeta correctamente si está inactiva y sin PIN', async () => {
        const { service, cardRepo } = getCtx();
        const cardId = 'card-id';

        const card: Card = {
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

        cardRepo.findOneBy.mockResolvedValue(card);
        cardRepo.save.mockResolvedValue({
            ...card,
            isActive: true,
            pin: 'hashed1234',
        });

        await service.activate(dto, cardId);

        expect(cardRepo.findOneBy).toHaveBeenCalledWith({ id: cardId });
        expect(cardRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({ isActive: true, pin: 'hashed1234' }),
        );
    });

    it('debería lanzar error si la tarjeta ya está activa', async () => {
        const { service, cardRepo } = getCtx();
        const cardId = 'card-id';

        cardRepo.findOneBy.mockResolvedValue({
            id: cardId,
            pin: 'already-hashed',
            isActive: true,
        } as Card);

        await expect(service.activate(dto, cardId)).rejects.toThrow(
            'La tarjeta ya está activa',
        );
    });
});
