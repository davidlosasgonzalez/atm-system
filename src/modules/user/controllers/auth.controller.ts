import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserService } from '../services/create-user.service';
import { DataResponse } from '@/shared/types/base-response.type';
import { User } from '../entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly createUserService: CreateUserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado', type: User })
    @ApiResponse({ status: 409, description: 'El email ya está en uso' })
    async register(
        @Body() dto: CreateUserDto,
    ): Promise<DataResponse<Omit<User, 'password'>>> {
        const user = await this.createUserService.execute(dto);

        const { password, ...safeUser } = user;

        return {
            status: 'ok',
            message: 'Usuario registrado correctamente.',
            data: safeUser,
        };
    }
}
