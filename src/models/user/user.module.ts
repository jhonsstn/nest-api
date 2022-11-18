import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasherModule } from '../../common/hasher/hasher.module';
import { AccountModule } from '../account/account.module';
import { AccountEntity } from '../account/entities/account.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccountEntity]),
    HasherModule,
    AccountModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
