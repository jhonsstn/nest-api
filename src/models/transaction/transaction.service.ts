import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}
  async addTransaction(
    debitedAccountId: string,
    creditedAccountId: string,
    value: number,
  ) {
    const transaction = new TransactionEntity({
      debitedAccountId,
      creditedAccountId,
      value,
    });

    const createdTransaction = await this.dataSource.manager.save(transaction);
    return createdTransaction;
  }

  async getTransactions(accountId: string) {
    const transactions = await this.dataSource.manager.find(TransactionEntity, {
      where: [
        { debitedAccountId: accountId },
        { creditedAccountId: accountId },
      ],
    });
    return transactions;
  }
}
