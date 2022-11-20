import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import mockedDataSource from '../../utils/mocks/data-source.mock';
import mockedData from '../../utils/mocks/data.mock';
import mockedUserService from '../../utils/mocks/user.service.mock';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockedUserService,
        },
        {
          provide: DataSource,
          useValue: mockedDataSource,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await controller.create({
      username: 'any_username',
      password: 'any_password',
    });
    expect(user).toEqual(mockedData.userWithAccount);
  });

  it('should get the balance of a user', async () => {
    const user = await controller.getBalance(mockedData.userWithAccount);
    expect(user).toEqual(mockedData.account);
  });

  it('should transfer money from a user to another', async () => {
    const user = await controller.transfer(
      {
        amount: 100,
        creditedId: 'any_id',
      },
      mockedData.userWithAccount,
    );
    expect(user).toEqual(mockedData.transaction);
  });

  it('should get the transactions of a user', async () => {
    const user = await controller.getTransactions(mockedData.userWithAccount);
    expect(user).toEqual([mockedData.transaction]);
  });

  it('should get the filtered transactions of a user', async () => {
    const user = await controller.getFilteredTransactions(
      mockedData.userWithAccount,
      {
        operation: 'any_operation',
        date: 'any_date',
      },
    );
    expect(user).toEqual([mockedData.transaction]);
  });
});
