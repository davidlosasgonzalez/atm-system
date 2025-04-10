import { ApiProperty } from '@nestjs/swagger';
import { Matches, Validate } from 'class-validator';
import { NewPinsMatchConstraint } from '../validators/new-pins-match.validator';

export class ChangeCardPinDto {
    @ApiProperty({ example: '1111', description: 'PIN actual' })
    @Matches(/^\d{4}$/, {
        message: 'El PIN actual debe contener exactamente 4 dígitos numéricos.',
    })
    readonly currentPin: string;

    @ApiProperty({ example: '1234', description: 'Nuevo PIN' })
    @Matches(/^\d{4}$/, {
        message: 'El nuevo PIN debe contener exactamente 4 dígitos numéricos.',
    })
    readonly newPin: string;

    @ApiProperty({ example: '1234', description: 'Repetir nuevo PIN' })
    @Matches(/^\d{4}$/, {
        message: 'El nuevo PIN debe contener exactamente 4 dígitos numéricos.',
    })
    @Validate(NewPinsMatchConstraint)
    readonly repeatedNewPin: string;
}
