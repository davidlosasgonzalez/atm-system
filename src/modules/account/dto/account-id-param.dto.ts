import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AccountIdParamDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID('4', { message: 'El ID de cuenta debe ser un UUID válido' })
    readonly accountId: string;
}
