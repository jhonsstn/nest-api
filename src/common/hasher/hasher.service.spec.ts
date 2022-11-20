import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import mockedConfigService from '../../utils/mocks/config.service.mock';
import { HasherModule } from './hasher.module';
import { HasherService } from './hasher.service';

jest.mock('bcrypt');

describe('HasherService', () => {
  let service: HasherService;
  let bcryptHashMock: jest.Mock;
  let bcryptCompareMock: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HasherModule],
      providers: [HasherService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(mockedConfigService)
      .compile();

    service = module.get<HasherService>(HasherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call bcrypt.hash() with the correct values', async () => {
    bcryptHashMock = jest.fn().mockResolvedValue('hash');
    (bcrypt.hash as jest.Mock) = bcryptHashMock;

    await service.hashPassword('password');

    expect(bcryptHashMock).toBeCalledWith('password', 10);
  });

  it('should call bcrypt.compare() with the correct values', async () => {
    bcryptCompareMock = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompareMock;

    await service.comparePasswords('password', 'hash');

    expect(bcryptCompareMock).toBeCalledWith('password', 'hash');
  });

  it('should return a hash from hashPassword()', async () => {
    bcryptHashMock = jest.fn().mockResolvedValue('hash');
    (bcrypt.hash as jest.Mock) = bcryptHashMock;

    expect(await service.hashPassword('password')).toBe('hash');
  });

  it('should return true from comparePasswords()', async () => {
    bcryptCompareMock = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompareMock;

    expect(await service.comparePasswords('password', 'hash')).toBe(true);
  });

  it('should return false from comparePasswords()', async () => {
    bcryptCompareMock = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompareMock;

    expect(await service.comparePasswords('password', 'hash')).toBe(false);
  });
});
