import { Body, Controller, Param, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { AccountIdParamDto } from '../account/dto/account-id-param.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('accounts/:accountId')
export class AccountCardController {
    constructor(private readonly cardService: CardService) {}

    @Post('cards')
    async create(
        @Param() { accountId }: AccountIdParamDto,
        @Body() createCardDto: CreateCardDto,
    ) {
        const card = await this.cardService.create(createCardDto, accountId);

        return {
            status: 'ok',
            message: 'Tarjeta creada, activación pendiente',
            data: {
                card,
            },
        };
    }
}
