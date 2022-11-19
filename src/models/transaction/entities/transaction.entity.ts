import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  debitedAccountId: string;

  @Column()
  creditedAccountId: string;

  @Exclude()
  @ManyToOne(() => AccountEntity, (account) => account.id)
  debitedAccount: AccountEntity;

  @Exclude()
  @ManyToOne(() => AccountEntity, (account) => account.id)
  creditedAccount: AccountEntity;

  @Column()
  value: number;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  constructor(partial?: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }
}
