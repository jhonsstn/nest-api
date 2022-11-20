import * as mockedDataSourceModules from './data-source.modules';

const mockedDataSource = {
  manager: {
    findOne: mockedDataSourceModules.mockedFindOneUser,
    save: mockedDataSourceModules.mockedSaveTransaction,
    find: mockedDataSourceModules.mockedFindTransactions,
  },

  getRepository: jest.fn().mockReturnValue({
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        getMany: mockedDataSourceModules.mockedGetManyTransactions,
      }),
    }),
  }),
  createQueryRunner: () => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: mockedDataSourceModules.mockedSaveUser,
    },
  }),
};

export default mockedDataSource;
