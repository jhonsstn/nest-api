import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(private readonly dataSource: DataSource) {}

  async getBalance(userId: string): Promise<AccountEntity> {
    const user = await this.dataSource.manager.findOne(UserEntity, {
      where: { id: userId },
      relations: ['account'],
    });
    return user.account;
  }
}
