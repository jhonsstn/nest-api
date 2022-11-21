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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SignedUser } from '../../decorators/signed-user.decorator';
import { AccountEntity } from '../account/entities/account.entity';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TransactionsFilterDto } from './dto/transactions-filter.dto';
import { TransferDto } from './dto/transfer.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const createdUser = await this._userService.create(createUserDto);
    return new UserEntity(createdUser);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (jwt)',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('balance')
  public async getBalance(
    @SignedUser() signedUser: UserEntity,
  ): Promise<AccountEntity> {
    const account = await this._userService.getBalance(signedUser);
    return new AccountEntity(account);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (jwt)',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('transfer')
  public async transfer(
    @Body() transferDto: TransferDto,
    @SignedUser() signedUser: UserEntity,
  ): Promise<TransactionEntity> {
    const transaction = await this._userService.transfer({
      ...transferDto,
      debitedId: signedUser.id,
    });
    return transaction;
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (jwt)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OmitType(TransactionEntity, ['debitedAccount', 'creditedAccount']),
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('transactions')
  public async getTransactions(
    @SignedUser() signedUser: UserEntity,
  ): Promise<TransactionEntity[]> {
    const transactions = await this._userService.getTransactions(signedUser);
    return transactions;
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (jwt)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: OmitType(TransactionEntity, ['debitedAccount', 'creditedAccount']),
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('transactions/filter')
  public async getFilteredTransactions(
    @SignedUser() signedUser: UserEntity,
    @Query() transactionsFilterDto: TransactionsFilterDto,
  ): Promise<TransactionEntity[]> {
    const { operation, date } = transactionsFilterDto;
    const transactions = await this._userService.getFilteredTransactions({
      signedUser,
      operation,
      date,
    });
    return transactions;
  }
}
