import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HasherService } from '../../common/hasher/hasher.service';
import { AccountEntity } from '../account/entities/account.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly hasherService: HasherService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const hash = await this.hasherService.hashPassword(password);
      const account = await queryRunner.manager.save(AccountEntity, {
        balance: 100,
      });
      const user = await queryRunner.manager.save(UserEntity, {
        username,
        password: hash,
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

  async findOne(username: string) {
    return await this.dataSource.manager.findOne(UserEntity, {
      where: { username },
    });
  }
}
