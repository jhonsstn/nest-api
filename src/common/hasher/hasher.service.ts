import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HasherService {
  private _salt: number;

  constructor(private readonly _configService: ConfigService) {
    this._salt = this._configService.get<number>('BCRYPT_SALT');
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +this._salt);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
