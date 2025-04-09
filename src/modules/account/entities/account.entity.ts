import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('accounts')
export class Account {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true })
    iban: string;

    // TypeORM recomienda usar 'string' para columnas decimales, ya que JavaScript no maneja bien la precisión de valores tipo 'number'.
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
