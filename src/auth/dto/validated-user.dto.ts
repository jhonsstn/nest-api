import { UserEntity } from '../../models/user/entities/user.entity';

export class ValidatedUserDto {
  readonly user: Omit<UserEntity, 'password'>;
}
