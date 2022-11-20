import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { HasherService } from '../../common/hasher/hasher.service';
import mockedAccountService from '../../utils/mocks/account.service.mock';
import mockedDataSource from '../../utils/mocks/data-source.mock';
import * as mockedDataSourceModules from '../../utils/mocks/data-source.modules';
import mockedData from '../../utils/mocks/data.mock';
import mockedHasherService from '../../utils/mocks/hasher.service.mock';
import mockedTransactionService from '../../utils/mocks/transaction.service.mock';
import mockedUserService from '../../utils/mocks/user.service.mock';
import { AccountService } from '../account/account.service';
import { AccountEntity } from '../account/entities/account.entity';
import { TransactionService } from '../transaction/transaction.service';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DataSource,
          useValue: mockedDataSource,
        },
        {
          provide: AccountService,
          useValue: mockedAccountService,
        },
        {
          provide: HasherService,
          useValue: mockedHasherService,
        },
        {
          provide: TransactionService,
          useValue: mockedTransactionService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create({
      username: 'any_username',
      password: 'any_password',
    });
    expect(user).toEqual(mockedData.userWithAccount);
  });

  it('should call queryRunner.manager.save() with correct params', async () => {
    const saveSpy = jest.spyOn(mockedDataSourceModules, 'mockedSaveUser');
    await service.create({
      username: 'any_username',
      password: 'any_password',
    });
    const user = new UserEntity(mockedData.userWithAccount);
    delete user.id;
    const account = new AccountEntity();
    expect(saveSpy).toHaveBeenCalledWith({ ...user, account });
  });

  it('should call hasherService.hashPassword() with correct params', async () => {
    const hashPasswordSpy = jest.spyOn(mockedHasherService, 'hashPassword');
    await service.create({
      username: 'any_username',
      password: 'any_password',
    });
    expect(hashPasswordSpy).toHaveBeenCalledWith('any_password');
  });

  it('should throw if queryRunner.manager.save() throws', async () => {
    mockedDataSourceModules.mockedSaveUser.mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(
      service.create({
        username: 'any_username',
        password: 'any_password',
      }),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw if hasherService.hashPassword() throws', async () => {
    mockedHasherService.hashPassword.mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(
      service.create({
        username: 'any_username',
        password: 'any_password',
      }),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw if user already exists', async () => {
    let error: Error & { code?: string };
    mockedDataSourceModules.mockedSaveUser.mockImplementationOnce(() => {
      error = new Error();
      error.code = '23505';
      throw error;
    });
    await expect(
      service.create({
        username: 'any_username',
        password: 'any_password',
      }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should return an user by username', async () => {
    const user = await service.findOne('any_username');
    expect(user).toEqual(mockedData.userWithAccount);
  });

  it('should call queryRunner.manager.findOne() with correct params', async () => {
    const findOneSpy = jest.spyOn(mockedDataSourceModules, 'mockedFindOneUser');
    await service.findOne('any_username');
    expect(findOneSpy).toHaveBeenCalledWith(UserEntity, {
      where: { username: 'any_username' },
      relations: ['account'],
    });
  });

  it('should make a transfer between accounts', async () => {
    const transaction = await service.transfer({
      creditedId: 'any_id',
      debitedId: 'another_id',
      amount: 100,
    });
    expect(transaction).toEqual(mockedData.transaction);
  });

  it('should call queryRunner.manager.save() with correct params', async () => {
    const saveSpy = jest.spyOn(mockedDataSourceModules, 'mockedSaveUser');
    await service.transfer({
      creditedId: 'any_id',
      debitedId: 'another_id',
      amount: 100,
    });
    expect(saveSpy).toHaveBeenNthCalledWith(1, mockedData.userWithAccount);
    expect(saveSpy).toHaveBeenNthCalledWith(2, mockedData.userWithAccount);
  });

  it('should call transactionService.addTransaction() with correct params', async () => {
    const addTransactionSpy = jest.spyOn(
      mockedTransactionService,
      'addTransaction',
    );
    await service.transfer({
      creditedId: 'any_id',
      debitedId: 'another_id',
      amount: 100,
    });
    expect(addTransactionSpy).toHaveBeenCalledWith('any_id', 'any_id', 100);
  });

  it('should throw if queryRunner.manager.save() throws', async () => {
    mockedDataSourceModules.mockedSaveUser.mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(
      service.transfer({
        creditedId: 'any_id',
        debitedId: 'another_id',
        amount: 100,
      }),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw if transactionService.addTransaction() throws', async () => {
    jest
      .spyOn(mockedTransactionService, 'addTransaction')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(
      service.transfer({
        creditedId: 'any_id',
        debitedId: 'another_id',
        amount: 100,
      }),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw if user try to transfer to himself', async () => {
    await expect(
      service.transfer({
        creditedId: 'any_id',
        debitedId: 'any_id',
        amount: 100,
      }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should throw if user does not have enough balance', async () => {
    await expect(
      service.transfer({
        creditedId: 'any_id',
        debitedId: 'another_id',
        amount: 100000,
      }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should throw if debited user does not exist', async () => {
    mockedDataSourceModules.mockedFindOneUser.mockImplementationOnce(() =>
      Promise.resolve(null),
    );
    await expect(
      service.transfer({
        creditedId: 'any_id',
        debitedId: 'another_id',
        amount: 100,
      }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should throw if credited user does not exist', async () => {
    mockedDataSourceModules.mockedFindOneUser
      .mockImplementationOnce(() => Promise.resolve(mockedData.userWithAccount))
      .mockImplementationOnce(() => Promise.resolve(null));
    await expect(
      service.transfer({
        creditedId: 'any_id',
        debitedId: 'another_id',
        amount: 100,
      }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should return an account with balance by id', async () => {
    const account = await service.getBalance(mockedData.userWithAccount);
    expect(account).toEqual(mockedData.account);
  });

  it('should return transactions when call getTransactions', async () => {
    jest
      .spyOn(mockedUserService, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(mockedData.userWithAccount),
      );

    const transactions = await service.getTransactions(
      mockedData.userWithAccount,
    );
    expect(transactions).toEqual([mockedData.transaction]);
  });

  it('should return filtered transactions when call getFilteredTransactions', async () => {
    jest
      .spyOn(mockedUserService, 'findOne')
      .mockImplementationOnce(() =>
        Promise.resolve(mockedData.userWithAccount),
      );

    const transactions = await service.getFilteredTransactions(
      mockedData.transactionFilterData,
    );
    expect(transactions).toEqual([mockedData.transaction]);
  });
});
