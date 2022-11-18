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
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountService: AccountService,
    private readonly hasherService: HasherService,
    private readonly transactionService: TransactionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const account = new AccountEntity();
      const user = new UserEntity({
        username,
        password: await this.hasherService.hashPassword(password),
        account,
      });
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
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

  async findOne(username: string): Promise<UserEntity> {
    return await this.dataSource.manager.findOne(UserEntity, {
      where: { username },
    });
  }

  async getBalance(signedUser: UserEntity): Promise<AccountEntity> {
    return await this.accountService.getBalance(signedUser.id);
  }

  async transfer(
    cashInId: string,
    cashOutId: string,
    amount: number,
  ): Promise<TransactionEntity> {
    if (cashInId === cashOutId) {
      throw new BadRequestException('you can only transfer to another user');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const cashOutUser = await queryRunner.manager.findOne(UserEntity, {
      where: { id: cashOutId },
      relations: ['account'],
    });
    if (!cashOutUser) {
      throw new BadRequestException('user with this id does not exist');
    }
    if (cashOutUser.account.balance < amount) {
      throw new BadRequestException('insufficient funds');
    }
    cashOutUser.account.balance -= amount;

    const cashInUser = await queryRunner.manager.findOne(UserEntity, {
      where: { id: cashInId },
      relations: ['account'],
    });
    if (!cashInUser) {
      throw new BadRequestException('user with this id does not exist');
    }
    cashInUser.account.balance += amount;

    try {
      await queryRunner.manager.save(cashOutUser);
      await queryRunner.manager.save(cashInUser);
      await queryRunner.commitTransaction();
      const transaction = await this.transactionService.addTransaction(
        cashOutUser.account,
        cashInUser.account,
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
}
