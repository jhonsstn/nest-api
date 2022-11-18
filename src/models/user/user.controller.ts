import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SignedUser } from '../../decorators/signed-user.decorator';
import { AccountEntity } from '../account/entities/account.entity';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TransferDto } from './dto/transfer.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = await this.userService.create(createUserDto);
    return new UserEntity(createdUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(
    @SignedUser() signedUser: UserEntity,
  ): Promise<AccountEntity> {
    const account = await this.userService.getBalance(signedUser);
    return new AccountEntity(account);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('transfer')
  async transfer(
    @Body() transferDto: TransferDto,
    @SignedUser() signedUser: UserEntity,
  ): Promise<TransactionEntity> {
    const transaction = await this.userService.transfer(
      transferDto.cashInId,
      signedUser.id,
      transferDto.amount,
    );
    return transaction;
  }
}
