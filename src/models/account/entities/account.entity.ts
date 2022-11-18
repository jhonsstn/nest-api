import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../../../helpers/column-numeric-transformer.helper';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('accounts')
export class AccountEntity {
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
}
