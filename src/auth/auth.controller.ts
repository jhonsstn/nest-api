import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidatedUserDto } from './dto/validated-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() validatedUserDto: ValidatedUserDto) {
    return this.authService.login(validatedUserDto.user);
  }
}
