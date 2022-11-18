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

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @OneToOne(() => AccountEntity, (account) => account.id, { cascade: true })
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
