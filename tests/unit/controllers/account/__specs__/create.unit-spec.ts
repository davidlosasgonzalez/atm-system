import { setupAccountControllerTestContext } from '../__utils__/test-context';

const getCtx = setupAccountControllerTestContext();

describe('AccountController - POST /accounts', () => {
    it('debería devolver status 200 y cuenta creada', async () => {
        const { controller, accountService, fakeAccount } = getCtx();

        accountService.create.mockResolvedValue(fakeAccount);

        const result = await controller.create();

        expect(result).toEqual({
            status: 'ok',
            message: 'Cuenta creada',
            data: { account: fakeAccount },
        });

        expect(accountService.create).toHaveBeenCalled();
    });
});
