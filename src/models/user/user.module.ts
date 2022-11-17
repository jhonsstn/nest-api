import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasherModule } from '../../common/hasher/hasher.module';
import { AccountEntity } from '../account/entities/account.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccountEntity]),
    HasherModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
