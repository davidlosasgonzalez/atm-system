import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    public async execute(dto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOneBy({
            email: dto.email,
        });

        if (existingUser) {
            throw new ConflictException('El email ya está en uso');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.userRepository.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            dni: dto.dni,
            phone: dto.phone,
            email: dto.email,
            password: hashedPassword,
            role: 'customer',
        });

        return this.userRepository.save(user);
    }
}
