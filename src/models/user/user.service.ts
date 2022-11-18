import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HasherService } from '../../common/hasher/hasher.service';
import { AccountEntity } from '../account/entities/account.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { TransferData } from './interfaces/transfer-data.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly hasherService: HasherService,
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

  async getBalance(userId: string, signedUser: UserEntity): Promise<number> {
    if (userId !== signedUser.id) {
      throw new UnauthorizedException('you can only get your own balance');
    }
    const user = await this.dataSource.manager.findOne(UserEntity, {
      where: { id: userId },
      relations: ['account'],
    });
    return user.account.balance;
  }

  async transfer(
    cashInId: string,
    cashOutId: string,
    amount: number,
  ): Promise<TransferData> {
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
    if (cashOutUser.account.balance < amount) {
      throw new BadRequestException('insufficient funds');
    }
    cashOutUser.account.balance -= amount;

    const cashInUser = await queryRunner.manager.findOne(UserEntity, {
      where: { id: cashInId },
      relations: ['account'],
    });
    cashInUser.account.balance += amount;

    try {
      await queryRunner.manager.save(cashOutUser);
      await queryRunner.manager.save(cashInUser);
      await queryRunner.commitTransaction();
      return { cashOutUser, cashInUser };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('transaction failed');
    } finally {
      await queryRunner.release();
    }
  }
}
