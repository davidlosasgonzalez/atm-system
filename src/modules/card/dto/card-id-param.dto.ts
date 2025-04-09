import { IsUUID } from 'class-validator';

export class CardIdParamDto {
    @IsUUID('4', { message: 'El ID de tarjeta debe ser un UUID válido' })
    cardId: string;
}
