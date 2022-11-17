import { UserEntity } from '../../models/user/entities/user.entity';

export class LoginDataDto {
  readonly user: UserEntity;
}
