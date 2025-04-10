import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CardIdParamDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID('4', { message: 'El ID de tarjeta debe ser un UUID válido' })
    readonly cardId: string;
}
