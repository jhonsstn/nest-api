import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HasherModule } from '../common/hasher/hasher.module';
import { UserModule } from '../models/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, HasherModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
