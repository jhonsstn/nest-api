import mockedData from './data.mock';

const mockedDataSource = {
  manager: {
    findOne: () => Promise.resolve(mockedData.userWithAccount),
    save: () => Promise.resolve(mockedData.transaction),
    find: () => Promise.resolve([mockedData.transaction]),
  },
  getRepository: () => ({
    createQueryBuilder: () => ({
      where: () => ({
        getMany: () => Promise.resolve([mockedData.transaction]),
      }),
    }),
  }),
};

export default mockedDataSource;
