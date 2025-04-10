import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

@Entity('accounts')
export class Account {
    @ApiProperty({ format: 'uuid' })
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @ApiProperty({ format: 'uuid' })
    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.accounts, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty({ example: 'ES9820385778983000760236' })
    @Column({ unique: true })
    iban: string;

    @ApiProperty({
        example: '1000.00',
        description: 'Saldo actual de la cuenta',
    })
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: string;

    @ApiProperty({ format: 'date-time' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
