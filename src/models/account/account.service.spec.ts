import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import mockedData from '../../../dist/utils/mocks/data.mock';
import mockedDataSource from '../../utils/mocks/data-source.mock';
import { UserEntity } from '../user/entities/user.entity';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, DataSource],
    })
      .overrideProvider(DataSource)
      .useValue(mockedDataSource)
      .compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an account', async () => {
    const account = await service.getBalance(mockedData.validatedUser.id);
    expect(account).toEqual(mockedData.validatedUser.account);
  });

  it('should call data source findOne with correct values', async () => {
    const findOneSpy = jest.spyOn(mockedDataSource.manager, 'findOne');
    await service.getBalance(mockedData.validatedUser.id);
    expect(findOneSpy).toHaveBeenCalledWith(UserEntity, {
      where: { id: mockedData.validatedUser.id },
      relations: ['account'],
    });
  });
});
