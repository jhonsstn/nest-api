import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly _dataSource: DataSource) {}

  public async addTransaction(
    debitedAccountId: string,
    creditedAccountId: string,
    value: number,
  ) {
    const transaction = new TransactionEntity({
      debitedAccountId,
      creditedAccountId,
      value,
    });

    const createdTransaction = await this._dataSource.manager.save(transaction);
    return createdTransaction;
  }

  public async getTransactions(accountId: string) {
    const transactions = await this._dataSource.manager.find(
      TransactionEntity,
      {
        where: [
          { debitedAccountId: accountId },
          { creditedAccountId: accountId },
        ],
      },
    );
    return transactions;
  }

  public async getFilteredTransactions(
    accountId: string,
    operation: string,
    date: string,
  ) {
    if (operation === 'credit') {
      return this._getCreditTransactions(accountId, date);
    }
    if (operation === 'debit') {
      return this._getDebitTransactions(accountId, date);
    }
    return this._getTransactionsByDate(accountId, date);
  }

  private async _getCreditTransactions(accountId: string, date: string) {
    if (date) {
      const transactions = await this._dataSource
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
    }
    const transactions = await this._dataSource.manager.find(
      TransactionEntity,
      {
        where: { creditedAccountId: accountId },
      },
    );
    return transactions;
  }

  private async _getDebitTransactions(accountId: string, date: string) {
    if (date) {
      const transactions = await this._dataSource
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
    }
    const transactions = await this._dataSource.manager.find(
      TransactionEntity,
      {
        where: { debitedAccountId: accountId },
      },
    );
    return transactions;
  }

  private async _getTransactionsByDate(accountId: string, date: string) {
    const transactions = await this._dataSource
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
