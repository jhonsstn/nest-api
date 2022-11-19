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

  async getFilteredTransactions(
    accountId: string,
    operation: string,
    date: string,
  ) {
    if (operation === 'credit') {
      return this.getCreditTransactions(accountId, date);
    }
    if (operation === 'debit') {
      return this.getDebitTransactions(accountId, date);
    }
    if (!operation) {
      return this.getTransactionsByDate(accountId, date);
    }
  }

  private async getCreditTransactions(accountId: string, date: string) {
    if (date) {
      const transactions = await this.dataSource
        .getRepository(TransactionEntity)
        .createQueryBuilder('transactions')
        .where(
          'DATE(transactions."createdAt") = :date AND transactions."creditedAccountId" = :accountId',
          {
            date,
            accountId,
          },
        )
        .getMany();
      return transactions;
    } else {
      const transactions = await this.dataSource.manager.find(
        TransactionEntity,
        {
          where: { creditedAccountId: accountId },
        },
      );
      return transactions;
    }
  }

  private async getDebitTransactions(accountId: string, date: string) {
    if (date) {
      const transactions = await this.dataSource
        .getRepository(TransactionEntity)
        .createQueryBuilder('transactions')
        .where(
          'DATE(transactions."createdAt") = :date AND transactions."debitedAccountId" = :accountId',
          {
            date,
            accountId,
          },
        )
        .getMany();
      return transactions;
    } else {
      const transactions = await this.dataSource.manager.find(
        TransactionEntity,
        {
          where: { debitedAccountId: accountId },
        },
      );
      return transactions;
    }
  }

  private async getTransactionsByDate(accountId: string, date: string) {
    const transactions = await this.dataSource
      .getRepository(TransactionEntity)
      .createQueryBuilder('transactions')
      .where(
        '(DATE(transactions."createdAt") = :date AND transactions."debitedAccountId" = :accountId) OR (DATE(transactions."createdAt") = :date AND transactions."creditedAccountId" = :accountId)',
        {
          date,
          accountId,
        },
      )
      .getMany();
    return transactions;
  }
}
