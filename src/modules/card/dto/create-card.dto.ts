import { IsIn } from 'class-validator';

export class CreateCardDto {
    @IsIn(['debit', 'credit'], {
        message: "El tipo de tarjeta debe ser 'debit' o 'credit'",
    })
    cardType: 'debit' | 'credit';
}
