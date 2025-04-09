import { Matches, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PinsMatchConstraint } from '../validators/pins-match.validator';

export class ActivateCardDto {
    @ApiProperty({ example: '1234', description: 'PIN numérico de 4 dígitos' })
    @Matches(/^\d{4}$/, {
        message: 'El PIN debe contener exactamente 4 dígitos numéricos.',
    })
    readonly pin: string;

    @ApiProperty({ example: '1234', description: 'Repetir PIN' })
    @Matches(/^\d{4}$/, {
        message: 'El PIN debe contener exactamente 4 dígitos numéricos.',
    })
    @Validate(PinsMatchConstraint)
    readonly repeatedPin: string;
}
