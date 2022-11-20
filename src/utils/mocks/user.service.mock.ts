import mockedData from './data.mock';

const mockedUserService = {
  findOne: jest.fn().mockResolvedValue(mockedData.userWithAccount),
  create: jest.fn().mockResolvedValue(mockedData.userWithAccount),
  getBalance: jest.fn().mockResolvedValue(mockedData.account),
  transfer: jest.fn().mockResolvedValue(mockedData.transaction),
  getTransactions: jest.fn().mockResolvedValue([mockedData.transaction]),
  getFilteredTransactions: jest
    .fn()
    .mockResolvedValue([mockedData.transaction]),
};

export default mockedUserService;
