import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SignedUser } from '../../decorators/signed-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
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
  @Get(':id/balance')
  async getBalance(
    @Param('id') userId: string,
    @SignedUser() signedUser: UserEntity,
  ): Promise<{ balance: number }> {
    const balance = await this.userService.getBalance(userId, signedUser);
    return { balance };
  }
}
