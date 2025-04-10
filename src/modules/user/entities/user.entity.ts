import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '@/modules/account/entities/account.entity';

export type UserRole = 'customer' | 'admin';

@Entity('users')
export class User {
    @ApiProperty({ format: 'uuid' })
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @ApiProperty({ example: 'Laura' })
    @Column()
    firstName: string;

    @ApiProperty({ example: 'Fernández' })
    @Column()
    lastName: string;

    @ApiProperty({ example: '12345678Z', description: 'DNI único del usuario' })
    @Column({ unique: true })
    dni: string;

    @ApiProperty({ example: '+34123456789', nullable: true })
    @Column({ nullable: true })
    phone?: string;

    @ApiProperty({ example: 'user@example.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        description: 'Password cifrada con bcrypt',
        minLength: 60,
        maxLength: 60,
    })
    @Column({ type: 'varchar', length: 60 })
    password: string;

    @ApiProperty({ enum: ['customer', 'admin'], default: 'customer' })
    @Column({ type: 'enum', enum: ['customer', 'admin'], default: 'customer' })
    role: UserRole;

    @ApiProperty({ format: 'date-time' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];
}
