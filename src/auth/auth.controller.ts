import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { CreateUserDto } from '../models/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthorizedUserDto } from './dto/authorized-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@User() userLoginDto: AuthorizedUserDto) {
    return this.authService.login(userLoginDto);
  }
}
