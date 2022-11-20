import mockedData from './data.mock';

const mockedUserService = {
  findOne: jest.fn().mockResolvedValue(mockedData.userWithAccount),
};

export default mockedUserService;
