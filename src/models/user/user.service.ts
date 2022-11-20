import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HasherService } from '../../common/hasher/hasher.service';
import { AccountService } from '../account/account.service';
import { AccountEntity } from '../account/entities/account.entity';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TransactionsFilterDto } from './dto/transactions-filter.dto';
import { TransferDto } from './dto/transfer.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _accountService: AccountService,
    private readonly _hasherService: HasherService,
    private readonly _transactionService: TransactionService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const account = new AccountEntity();
      const user = new UserEntity({
        username,
        password: await this._hasherService.hashPassword(password),
        account,
      });
      const createdUser = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return createdUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new BadRequestException('user with this username already exists');
      }
      throw new InternalServerErrorException('transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  public async findOne(username: string): Promise<UserEntity> {
    return await this._dataSource.manager.findOne(UserEntity, {
      where: { username },
      relations: ['account'],
    });
  }

  public async getBalance(signedUser: UserEntity): Promise<AccountEntity> {
    return await this._accountService.getBalance(signedUser.id);
  }

  public async transfer({
    creditedId,
    debitedId,
    amount,
  }: TransferDto & { debitedId: string }): Promise<TransactionEntity> {
    if (creditedId === debitedId) {
      throw new BadRequestException('you can only transfer to another user');
    }
    const debitedUser = await this._getDebitedUser(debitedId);
    if (debitedUser.account.balance < amount) {
      throw new BadRequestException('insufficient funds');
    }

    debitedUser.account.balance -= amount;

    const creditedUser = await this._getCreditedUser(creditedId);
    if (!creditedUser) {
      throw new BadRequestException('user with this id does not exist');
    }

    creditedUser.account.balance += amount;

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(debitedUser);
      await queryRunner.manager.save(creditedUser);
      await queryRunner.commitTransaction();
      const transaction = await this._transactionService.addTransaction(
        debitedUser.account.id,
        creditedUser.account.id,
        amount,
      );
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  private async _getDebitedUser(debitedUserId: string): Promise<UserEntity> {
    const queryRunner = this._dataSource.createQueryRunner();
    const debitedUser = await queryRunner.manager.findOne(UserEntity, {
      where: { id: debitedUserId },
      relations: ['account'],
    });
    if (!debitedUser) {
      throw new BadRequestException('user with this id does not exist');
    }
    return debitedUser;
  }

  private async _getCreditedUser(creditedUserId: string): Promise<UserEntity> {
    const queryRunner = this._dataSource.createQueryRunner();
    const creditedUser = await queryRunner.manager.findOne(UserEntity, {
      where: { id: creditedUserId },
      relations: ['account'],
    });
    if (!creditedUserId) {
      throw new BadRequestException('user with this id does not exist');
    }
    return creditedUser;
  }

  public async getTransactions(signedUser: UserEntity) {
    const account = (await this.findOne(signedUser.username)).account;
    return await this._transactionService.getTransactions(account.id);
  }

  public async getFilteredTransactions({
    signedUser,
    operation,
    date,
  }: TransactionsFilterDto & { signedUser: UserEntity }): Promise<
    TransactionEntity[]
  > {
    const account = (await this.findOne(signedUser.username)).account;
    return await this._transactionService.getFilteredTransactions(
      account.id,
      operation,
      date,
    );
  }
}
