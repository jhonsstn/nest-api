import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await queryRunner.manager.save(AccountEntity, {
        balance: 100,
      });
      const user = await queryRunner.manager.save(UserEntity, {
        ...createUserDto,
        accountId: account.id,
      });
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
}
