import mockedData from './data.mock';

const mockedUserService = {
  findOne: () => mockedData.validatedUser,
};

export default mockedUserService;
