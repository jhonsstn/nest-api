import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../../models/user/entities/user.entity';

export class AuthorizedUserDto extends OmitType(UserEntity, [
  'password',
] as const) {}
