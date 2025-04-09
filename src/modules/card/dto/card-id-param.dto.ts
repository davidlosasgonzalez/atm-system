import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardIdParamDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID('4', { message: 'El ID de tarjeta debe ser un UUID válido' })
    readonly cardId: string;
}
