import { Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    async create() {
        const account = await this.accountService.create();

        return {
            status: 'ok',
            message: 'Cuenta creada',
            data: {
                account,
            },
        };
    }
}
