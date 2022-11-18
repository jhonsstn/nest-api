import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}
  async addTransaction(
    debitedAccount: AccountEntity,
    creditedAccount: AccountEntity,
    value: number,
  ) {
    const transaction = new TransactionEntity({
      debitedAccount,
      creditedAccount,
      value,
    });
    const createdTransaction = await this.dataSource.manager.save(transaction);
    return createdTransaction;
  }
}
