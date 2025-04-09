import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
    @ApiProperty({ enum: ['debit', 'credit'] })
    @IsIn(['debit', 'credit'], {
        message: "El tipo de tarjeta debe ser 'debit' o 'credit'",
    })
    readonly cardType: 'debit' | 'credit';
}
