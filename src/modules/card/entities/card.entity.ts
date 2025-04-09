import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@/modules/account/entities/account.entity';

export type CardType = 'debit' | 'credit';

@Entity('cards')
export class Card {
    @ApiProperty({ format: 'uuid' })
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @ApiProperty({ format: 'uuid' })
    @Column({ name: 'account_id' })
    accountId: string;

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ApiProperty({ example: '12345678901234567890' })
    @Column({ type: 'char', length: 20, unique: true })
    number: string;

    @ApiProperty({ nullable: true, description: 'PIN cifrado con bcrypt' })
    @Column({ type: 'varchar', length: 60, nullable: true })
    pin: string | null;

    @ApiProperty({ default: false })
    @Column({ name: 'is_active', type: 'boolean', default: false })
    isActive: boolean;

    @ApiProperty({ enum: ['debit', 'credit'] })
    @Column({ name: 'card_type', type: 'enum', enum: ['debit', 'credit'] })
    cardType: CardType;

    @ApiProperty({ default: 1000, description: 'Límite diario de retirada' })
    @Column({ name: 'withdrawal_limit', type: 'int', default: 1000 })
    withdrawalLimit: number;

    @ApiProperty({
        nullable: true,
        description: 'Solo para tarjetas de crédito',
    })
    @Column({ name: 'credit_limit', type: 'int', nullable: true })
    creditLimit: number;

    @ApiProperty({ format: 'date-time' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
