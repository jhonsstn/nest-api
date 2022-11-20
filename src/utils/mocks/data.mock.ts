import { AccountEntity } from '../../models/account/entities/account.entity';
import { TransactionEntity } from '../../models/transaction/entities/transaction.entity';
import { TransactionsFilterDto } from '../../models/user/dto/transactions-filter.dto';
import { TransferDto } from '../../models/user/dto/transfer.dto';
import { UserEntity } from '../../models/user/entities/user.entity';

interface MockedData {
  validatedUser: Omit<UserEntity, 'password'>;
  loginToken: { access_token: string };
  userWithAccount: UserEntity;
  transaction: Omit<TransactionEntity, 'debitedAccount' | 'creditedAccount'>;
  account: AccountEntity;
  transferData: TransferDto & { debitedId: string };
  transactionFilterData: TransactionsFilterDto & { signedUser: UserEntity };
}

const mockedData: MockedData = {
  validatedUser: {
    id: 'any_id',
    username: 'any_username',
    account: {
      id: 'any_id',
      balance: 100,
    },
  },
  loginToken: { access_token: 'token' },
  userWithAccount: {
    id: 'any_id',
    username: 'any_username',
    password: 'hashed_password',
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

  account: {
    id: 'any_id',
    balance: 100,
  },
  transferData: {
    creditedId: 'any_id',
    debitedId: 'any_id',
    amount: 100,
  },
  transactionFilterData: {
    signedUser: {
      id: 'any_id',
      username: 'any_username',
      password: 'hashed_password',
      account: {
        id: 'any_id',
        balance: 100,
      },
    },
    operation: 'any_operation',
    date: '1-1-1',
  },
};

export default mockedData;
