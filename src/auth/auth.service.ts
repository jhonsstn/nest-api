import { Injectable } from '@nestjs/common';
import { HasherService } from '../common/hasher/hasher.service';
import { UserService } from '../models/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly hasherService: HasherService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
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
}
