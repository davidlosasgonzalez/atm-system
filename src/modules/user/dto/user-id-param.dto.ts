import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserIdParamDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
    readonly userId: string;
}
