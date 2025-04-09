import { Controller, Put, Param, Body, Patch } from '@nestjs/common';
import { CardService } from './card.service';
import { CardIdParamDto } from './dto/card-id-param.dto';
import { ActivateCardDto } from './dto/activate-card.dto';
import { ChangeCardPinDto } from './dto/change-card-pin.dto';

@Controller('cards/:cardId')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Put('activate')
    async activate(
        @Param() { cardId }: CardIdParamDto,
        @Body() activateCardDto: ActivateCardDto,
    ) {
        await this.cardService.activate(activateCardDto, cardId);

        return {
            status: 'ok',
            message: 'Tarjeta activada.',
        };
    }

    @Patch('pin')
    async changeCardPin(
        @Param() { cardId }: CardIdParamDto,
        @Body() changeCardPinDto: ChangeCardPinDto,
    ) {
        await this.cardService.changeCardPin(changeCardPinDto, cardId);

        return {
            status: 'ok',
            message: 'Pin actualizado',
        };
    }
}
