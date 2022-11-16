import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      username: 'john',
      password: 'ChangeMe',
    },
  ];

  async create(createUserDto: CreateUserDto) {
    this.users.push({ ...createUserDto, id: this.users.length + 1 });
  }
}
