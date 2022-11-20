import mockedData from './data.mock';

const mockedAuthService = {
  login: () => mockedData.loginToken,
};

export default mockedAuthService;
