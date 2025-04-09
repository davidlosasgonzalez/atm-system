import { Account } from '@/modules/account/entities/account.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

type CardType = 'debit' | 'credit';

@Entity('cards')
export class Card {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'account_id' })
    accountId: string;

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ type: 'char', length: 20, unique: true })
    number: string;

    @Column({ type: 'varchar', length: 60, nullable: true })
    pin: string | null;

    @Column({ name: 'is_active', type: 'boolean', default: false })
    isActive: boolean;

    @Column({ name: 'card_type', type: 'enum', enum: ['debit', 'credit'] })
    cardType: CardType;

    @Column({ name: 'withdrawal_limit', type: 'int', default: 1000 })
    withdrawalLimit: number;

    @Column({ name: 'credit_limit', type: 'int', nullable: true })
    creditLimit: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
