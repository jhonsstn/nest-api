import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HasherService } from '../common/hasher/hasher.service';
import { UserEntity } from '../models/user/entities/user.entity';
import { UserService } from '../models/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hasherService: HasherService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOne(username);
    if (
      user &&
      (await this.hasherService.comparePasswords(password, user.password))
    ) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: Omit<UserEntity, 'password'>) {
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
