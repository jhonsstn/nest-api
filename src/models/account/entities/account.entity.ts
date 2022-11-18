import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../../../helpers/column-numeric-transformer.helper';

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

  constructor(partial?: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }
}
