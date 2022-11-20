import mockedData from './data.mock';

const mockedDataSource = {
  manager: {
    findOne: () => Promise.resolve(mockedData.userWithAccount),
  },
};

export default mockedDataSource;
