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

  @Column()
  password: string;

  @Column()
  accountId: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;
}
