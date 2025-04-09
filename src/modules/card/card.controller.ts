import { Controller, Put, Param, Body, Patch } from '@nestjs/common';
import { CardService } from './card.service';
import { CardIdParamDto } from './dto/card-id-param.dto';
import { ActivateCardDto } from './dto/activate-card.dto';
import { ChangeCardPinDto } from './dto/change-card-pin.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BaseResponse } from '@/shared/types/base-response.type';

@ApiTags('Cards')
@Controller('cards/:cardId')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Put('activate')
    @ApiOperation({ summary: 'Activar una tarjeta con un PIN' })
    async activate(
        @Param() { cardId }: CardIdParamDto,
        @Body() activateCardDto: ActivateCardDto,
    ): Promise<BaseResponse> {
        await this.cardService.activate(activateCardDto, cardId);

        return {
            status: 'ok',
            message: 'Tarjeta activada.',
        };
    }

    @Patch('pin')
    @ApiOperation({ summary: 'Cambiar el PIN de una tarjeta activa' })
    async changeCardPin(
        @Param() { cardId }: CardIdParamDto,
        @Body() changeCardPinDto: ChangeCardPinDto,
    ): Promise<BaseResponse> {
        await this.cardService.changeCardPin(changeCardPinDto, cardId);

        return {
            status: 'ok',
            message: 'Pin actualizado',
        };
    }
}
