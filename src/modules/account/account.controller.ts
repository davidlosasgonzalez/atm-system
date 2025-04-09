import { Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Account } from './entities/account.entity';
import { DataResponse } from '@/shared/types/base-response.type';

type AccountResponseData = {
    account: Account;
};

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva cuenta bancaria' })
    async create(): Promise<DataResponse<AccountResponseData>> {
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
