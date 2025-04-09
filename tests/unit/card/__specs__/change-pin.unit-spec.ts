import { setupCardServiceTestContext } from '../__utils__/test-context';
import { Card } from '@/modules/card/entities/card.entity';
import { ChangeCardPinDto } from '@/modules/card/dto/change-card-pin.dto';

const getCtx = setupCardServiceTestContext();

describe('CardService - changeCardPin()', () => {
    it('debería cambiar correctamente el PIN si todo es válido', async () => {
        const { service, cardRepo, hashingService } = getCtx();
        const cardId = 'card-id';
        const oldPin = 'hashed-old';
        const newPin = 'hashed-new';

        const card: Card = {
            id: cardId,
            isActive: true,
            pin: oldPin,
        } as Card;

        const dto: ChangeCardPinDto = {
            currentPin: '1234',
            newPin: '5678',
            repeatedNewPin: '5678',
        };

        cardRepo.findOneBy.mockResolvedValue(card);
        hashingService.compare.mockResolvedValueOnce(false);
        hashingService.compare.mockResolvedValueOnce(true);
        hashingService.hash.mockResolvedValue(newPin);

        await service.changeCardPin(dto, cardId);

        expect(hashingService.compare).toHaveBeenCalledWith('5678', oldPin);
        expect(hashingService.compare).toHaveBeenCalledWith('1234', oldPin);
        expect(hashingService.hash).toHaveBeenCalledWith('5678');
        expect(cardRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({ pin: newPin }),
        );
    });

    it('debería lanzar error si la tarjeta está inactiva', async () => {
        const { service, cardRepo } = getCtx();
        const cardId = 'card-id';

        const card: Card = {
            id: cardId,
            isActive: false,
            pin: 'hashed-pin',
        } as Card;

        const dto: ChangeCardPinDto = {
            currentPin: '1234',
            newPin: '5678',
            repeatedNewPin: '5678',
        };

        cardRepo.findOneBy.mockResolvedValue(card);

        await expect(service.changeCardPin(dto, cardId)).rejects.toThrow(
            'La tarjeta debe estar activa para poder cambiar el PIN.',
        );
    });

    it('debería lanzar error si la tarjeta no tiene PIN configurado', async () => {
        const { service, cardRepo } = getCtx();
        const cardId = 'card-id';

        const card: Card = {
            id: cardId,
            isActive: true,
            pin: null,
        } as Card;

        const dto: ChangeCardPinDto = {
            currentPin: '1234',
            newPin: '5678',
            repeatedNewPin: '5678',
        };

        cardRepo.findOneBy.mockResolvedValue(card);

        await expect(service.changeCardPin(dto, cardId)).rejects.toThrow(
            'La tarjeta aún no tiene PIN configurado.',
        );
    });

    it('debería lanzar error si el PIN actual no coincide', async () => {
        const { service, cardRepo, hashingService } = getCtx();
        const cardId = 'card-id';
        const oldPin = 'hashed';

        const dto: ChangeCardPinDto = {
            currentPin: '1234',
            newPin: '5678',
            repeatedNewPin: '5678',
        };

        cardRepo.findOneBy.mockResolvedValue({
            id: cardId,
            isActive: true,
            pin: oldPin,
        } as Card);

        hashingService.compare.mockResolvedValueOnce(false);

        await expect(service.changeCardPin(dto, cardId)).rejects.toThrow(
            'El PIN actual es incorrecto',
        );
    });
});
