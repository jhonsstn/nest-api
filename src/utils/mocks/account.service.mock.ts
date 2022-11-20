import mockedData from './data.mock';

const mockedAccountService = {
  getBalance: () => Promise.resolve(mockedData.account),
};

export default mockedAccountService;
