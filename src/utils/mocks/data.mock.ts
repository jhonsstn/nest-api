import { TransactionEntity } from '../../models/transaction/entities/transaction.entity';
import { UserEntity } from '../../models/user/entities/user.entity';

interface MockedData {
  validatedUser: Omit<UserEntity, 'password'>;
  loginToken: { access_token: string };
  userWithAccount: UserEntity;
  transaction: Omit<TransactionEntity, 'debitedAccount' | 'creditedAccount'>;
}

const mockedData: MockedData = {
  validatedUser: {
    id: 'any_id',
    username: 'any_user',
    account: {
      id: 'any_id',
      balance: 100,
    },
  },
  loginToken: { access_token: 'token' },
  userWithAccount: {
    id: 'any_id',
    username: 'any_user',
    password: 'any_password',
    account: {
      id: 'any_id',
      balance: 100,
    },
  },
  transaction: {
    id: 'any_id',
    debitedAccountId: 'any_id',
    creditedAccountId: 'any_id',
    value: 100,
    createdAt: new Date('1-1-1'),
  },
};

export default mockedData;
