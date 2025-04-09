import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountIdParamDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID('4', { message: 'El ID de cuenta debe ser un UUID válido' })
    readonly accountId: string;
}
