import { setupCardControllerTestContext } from '../__utils__/test-context';

const getCtx = setupCardControllerTestContext();

describe('CardController - PUT /cards/:cardId/activate', () => {
    it('debería activar la tarjeta correctamente', async () => {
        const { cardController, cardService, activateCardDto, fakeCard } =
            getCtx();

        const result = await cardController.activate(
            { cardId: fakeCard.id },
            activateCardDto,
        );

        expect(cardService.activate).toHaveBeenCalledWith(
            activateCardDto,
            fakeCard.id,
        );

        expect(result).toEqual({
            status: 'ok',
            message: 'Tarjeta activada.',
        });
    });
});
