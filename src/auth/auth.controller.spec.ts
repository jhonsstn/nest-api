import { Test, TestingModule } from '@nestjs/testing';
import mockedAuthService from '../utils/mocks/auth.service.mock';
import mockedData from '../utils/mocks/data.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockedAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token if user is valid', async () => {
    const token = await controller.login({ user: mockedData.validatedUser });
    expect(token).toEqual(mockedData.loginToken);
  });

  it('should be called with correct params', async () => {
    const loginSpy = jest.spyOn(mockedAuthService, 'login');
    await controller.login({ user: mockedData.validatedUser });
    expect(loginSpy).toHaveBeenCalledWith(mockedData.validatedUser);
  });
});
