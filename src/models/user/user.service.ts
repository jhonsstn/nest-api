import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      username: 'john',
      password: 'ChangeMe',
    },
  ];

  async create(user: any) {
    this.users.push(user);
  }
}
