import { setupCardControllerTestContext } from '../__utils__/test-context';

const getCtx = setupCardControllerTestContext();

describe('AccountCardController - POST /accounts/:accountId/cards', () => {
    it('debería crear y devolver una tarjeta correctamente', async () => {
        const { accountCardController, cardService, fakeCard, createCardDto } =
            getCtx();

        cardService.create.mockResolvedValue(fakeCard);

        const result = await accountCardController.create(
            { accountId: fakeCard.accountId },
            createCardDto,
        );

        expect(result).toEqual({
            status: 'ok',
            message: 'Tarjeta creada, activación pendiente',
            data: { card: fakeCard },
        });

        expect(cardService.create).toHaveBeenCalledWith(
            createCardDto,
            fakeCard.accountId,
        );
    });
});
