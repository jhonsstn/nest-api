import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import mockedDataSource from '../../utils/mocks/data-source.mock';
import * as mockedDataSourceModules from '../../utils/mocks/data-source.modules';
import mockedData from '../../utils/mocks/data.mock';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService, DataSource],
    })
      .overrideProvider(DataSource)
      .useValue(mockedDataSource)
      .compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a transaction when addTransaction is called', async () => {
    const transaction = await service.addTransaction('any_id', 'any_id', 100);
    expect(transaction).toEqual(mockedData.transaction);
  });

  it('should call dataSource save method with the correct params', async () => {
    const saveSpy = jest.spyOn(mockedDataSource.manager, 'save');
    await service.addTransaction('any_id', 'any_id', 100);
    const transaction = new TransactionEntity(mockedData.transaction);
    delete transaction.id;
    delete transaction.createdAt;
    expect(saveSpy).toHaveBeenCalledWith(transaction);
  });

  it('should return a list of transactions when getTransactions is called', async () => {
    const transactions = await service.getTransactions('any_id');
    expect(transactions).toEqual([mockedData.transaction]);
  });

  it('should call dataSource find method with the correct params', async () => {
    const findSpy = jest.spyOn(
      mockedDataSourceModules,
      'mockedFindTransactions',
    );
    await service.getTransactions('any_id');
    expect(findSpy).toHaveBeenCalledWith(TransactionEntity, {
      where: [{ debitedAccountId: 'any_id' }, { creditedAccountId: 'any_id' }],
    });
  });

  it('should return a list of transactions when getFilteredTransactions is called with credit operation and date', async () => {
    const transactions = await service.getFilteredTransactions(
      'any_id',
      'credit',
      'any_date',
    );
    expect(transactions).toEqual([mockedData.transaction]);
  });

  it('should return a list of transactions when getFilteredTransactions is called with debit operation ans date', async () => {
    const transactions = await service.getFilteredTransactions(
      'any_id',
      'debit',
      'any_date',
    );
    expect(transactions).toEqual([mockedData.transaction]);
  });

  it('should filter transactions by operation when getFilteredTransactions is called with only debit operation', async () => {
    const transactions = await service.getFilteredTransactions(
      'any_id',
      'debit',
      null,
    );
    expect(transactions).toEqual([mockedData.transaction]);
  });

  it('should call dataSource find method with the correct params when getFilteredTransactions is called with only debit operation', async () => {
    const findSpy = jest.spyOn(mockedDataSource.manager, 'find');
    await service.getFilteredTransactions('any_id', 'debit', null);
    const transaction = new TransactionEntity(mockedData.transaction);
    delete transaction.id;
    delete transaction.createdAt;
    expect(findSpy).toHaveBeenCalledWith(TransactionEntity, {
      where: { debitedAccountId: 'any_id' },
    });
  });

  it('should filter transactions by operation when getFilteredTransactions is called with only credit operation', async () => {
    const transactions = await service.getFilteredTransactions(
      'any_id',
      'credit',
      null,
    );
    expect(transactions).toEqual([mockedData.transaction]);
  });

  it('should call dataSource find method with the correct params when getFilteredTransactions is called with only credit operation', async () => {
    const findSpy = jest.spyOn(mockedDataSource.manager, 'find');
    await service.getFilteredTransactions('any_id', 'credit', null);
    const transaction = new TransactionEntity(mockedData.transaction);
    delete transaction.id;
    delete transaction.createdAt;
    expect(findSpy).toHaveBeenCalledWith(TransactionEntity, {
      where: { creditedAccountId: 'any_id' },
    });
  });

  it('should filter transactions by date when getFilteredTransactions is called with any date', async () => {
    const transactions = await service.getFilteredTransactions(
      'any_id',
      null,
      'any_date',
    );
    expect(transactions).toEqual([mockedData.transaction]);
  });

  it('should call dataSource getMany method when getFilteredTransactions is called with any date', async () => {
    const getRepositorySpy = jest.spyOn(
      mockedDataSourceModules,
      'mockedGetManyTransactions',
    );
    await service.getFilteredTransactions('any_id', null, 'any_date');
    expect(getRepositorySpy).toHaveBeenCalled();
  });
});
