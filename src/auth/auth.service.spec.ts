import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { HasherService } from '../common/hasher/hasher.service';
import { UserService } from '../models/user/user.service';
import mockedData from '../utils/mocks/data.mock';
import mockedHasherService from '../utils/mocks/hasher.service.mock';
import mockedJwtService from '../utils/mocks/jwt.service.mock';
import mockedUserService from '../utils/mocks/user.service.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
        {
          provide: HasherService,
          useValue: mockedHasherService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user if user is valid', async () => {
    const user = await service.validateUser('test', 'test');
    expect(user).toEqual(mockedData.validatedUser);
  });

  it('should return null if user is invalid', async () => {
    jest.spyOn(mockedUserService, 'findOne').mockImplementation(() => null);
    const user = await service.validateUser('test', 'invalid');
    expect(user).toBeNull();
  });

  it('should return a token if user is valid', async () => {
    const token = await service.login(mockedData.validatedUser);
    expect(token).toEqual({ access_token: 'token' });
  });
});
