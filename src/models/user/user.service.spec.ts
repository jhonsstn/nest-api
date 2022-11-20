import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { HasherService } from '../../common/hasher/hasher.service';
import mockedAccountService from '../../utils/mocks/account.service.mock';
import mockedDataSource from '../../utils/mocks/data-source.mock';
import mockedHasherService from '../../utils/mocks/hasher.service.mock';
import mockedTransactionService from '../../utils/mocks/transaction.service.mock';
import { AccountService } from '../account/account.service';
import { TransactionService } from '../transaction/transaction.service';
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
