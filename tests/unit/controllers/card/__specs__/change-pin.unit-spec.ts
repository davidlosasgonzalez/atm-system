import { setupCardControllerTestContext } from '../__utils__/test-context';

const getCtx = setupCardControllerTestContext();

describe('CardController - PATCH /cards/:cardId/pin', () => {
    it('debería actualizar el PIN correctamente', async () => {
        const { cardController, cardService, changeCardPinDto, fakeCard } =
            getCtx();

        const result = await cardController.changeCardPin(
            { cardId: fakeCard.id },
            changeCardPinDto,
        );

        expect(cardService.changeCardPin).toHaveBeenCalledWith(
            changeCardPinDto,
            fakeCard.id,
        );

        expect(result).toEqual({
            status: 'ok',
            message: 'Pin actualizado',
        });
    });
});
