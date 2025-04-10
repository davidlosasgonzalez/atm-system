import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'Laura' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Fernández' })
    @IsString()
    lastName: string;

    @ApiProperty({ example: '12345678Z' })
    @IsString()
    dni: string;

    @ApiProperty({ example: '+34123456789', nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongPassw0rd!', minLength: 8 })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un símbolo',
    })
    password: string;
}
