import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';

export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  debitedAccount: AccountEntity;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  creditedAccount: AccountEntity;

  @Column()
  value: number;

  @Column()
  createdAt: Date;
}
