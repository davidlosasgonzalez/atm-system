import { IsUUID } from 'class-validator';

export class AccountIdParamDto {
    @IsUUID('4', { message: 'El ID de cuenta debe ser un UUID válido' })
    accountId: string;
}
