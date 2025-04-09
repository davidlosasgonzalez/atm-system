import { Body, Controller, Param, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { AccountIdParamDto } from '../account/dto/account-id-param.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Card } from './entities/card.entity';
import { DataResponse } from '@/shared/types/base-response.type';

type CardResponseData = {
    card: Card;
};

@ApiTags('Cards')
@Controller('accounts/:accountId')
export class AccountCardController {
    constructor(private readonly cardService: CardService) {}

    @Post('cards')
    @ApiOperation({ summary: 'Crear una tarjeta para una cuenta existente' })
    async create(
        @Param() { accountId }: AccountIdParamDto,
        @Body() createCardDto: CreateCardDto,
    ): Promise<DataResponse<CardResponseData>> {
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
