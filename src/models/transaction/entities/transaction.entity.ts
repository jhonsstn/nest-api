import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  debitedAccount: AccountEntity;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  creditedAccount: AccountEntity;

  @Column()
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(partial?: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }
}
