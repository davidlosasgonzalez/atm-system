import { setupAccountServiceTestContext } from '../__utils__/test-context';

const getCtx = setupAccountServiceTestContext();

describe('AccountService - create()', () => {
    it('debería crear y guardar una cuenta correctamente', async () => {
        const { service, accountRepo, fakeAccount } = getCtx();

        accountRepo.create.mockReturnValue(fakeAccount);
        accountRepo.save.mockResolvedValue(fakeAccount);

        const result = await service.create();

        expect(accountRepo.create).toHaveBeenCalled();
        expect(accountRepo.save).toHaveBeenCalledWith(fakeAccount);
        expect(result).toEqual(fakeAccount);
    });

    it('debería lanzar un error si falla el guardado', async () => {
        const { service, accountRepo, fakeAccount } = getCtx();

        accountRepo.create.mockReturnValue(fakeAccount);
        accountRepo.save.mockRejectedValue(new Error('Error en base de datos'));

        await expect(service.create()).rejects.toThrow(
            'Error en base de datos',
        );
    });
});
