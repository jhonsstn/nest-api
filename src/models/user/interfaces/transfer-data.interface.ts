import { UserEntity } from '../entities/user.entity';

export interface TransferData {
  cashOutUser: UserEntity;
  cashInUser: UserEntity;
}
