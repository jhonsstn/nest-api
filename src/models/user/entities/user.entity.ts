import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  accountId: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
