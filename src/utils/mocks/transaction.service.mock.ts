import mockedData from './data.mock';

const mockedTransactionService = {
  addTransaction: () => Promise.resolve(mockedData.transaction),
  getTransactions: () => Promise.resolve([mockedData.transaction]),
  getFilteredTransactions: () => Promise.resolve([mockedData.transaction]),
};

export default mockedTransactionService;
