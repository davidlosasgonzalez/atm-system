import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { CreateUserService } from './services/create-user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [CreateUserService],
})
export class UserModule {}
