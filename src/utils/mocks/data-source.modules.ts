import mockedData from './data.mock';

export const mockedGetManyTransactions = jest
  .fn()
  .mockResolvedValue([mockedData.transaction]);

export const mockedSaveUser = jest
  .fn()
  .mockResolvedValue(mockedData.userWithAccount);

export const mockedFindOneUser = jest
  .fn()
  .mockResolvedValue(mockedData.userWithAccount);

export const mockedSaveTransaction = jest
  .fn()
  .mockResolvedValue(mockedData.transaction);

export const mockedFindTransactions = jest
  .fn()
  .mockResolvedValue([mockedData.transaction]);
