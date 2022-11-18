import { Exclude } from 'class-transformer';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../../../helpers/column-numeric-transformer.helper';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('accounts')
export class AccountEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 100,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @OneToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  constructor(partial?: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }
}
