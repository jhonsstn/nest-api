import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
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
    const transaction = await this.userService.transfer({
      ...transferDto,
      debitedId: signedUser.id,
    });
    return transaction;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('transactions')
  async getTransactions(
    @SignedUser() signedUser: UserEntity,
  ): Promise<TransactionEntity[]> {
    const transactions = await this.userService.getTransactions(signedUser);
    return transactions;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('transactions/filter')
  async getFilteredTransactions(
    @SignedUser() signedUser,
    @Query() query,
  ): Promise<TransactionEntity[]> {
    console.log(query);
    const transactions = await this.userService.getFilteredTransactions(
      signedUser,
      query.operation,
      query.date,
    );
    return transactions;
  }
}
