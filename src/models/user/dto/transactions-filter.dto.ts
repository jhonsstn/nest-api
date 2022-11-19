import { IsOptional, IsString } from 'class-validator';

export class TransactionsFilterDto {
  @IsString()
  @IsOptional()
  readonly operation: string;

  @IsString()
  @IsOptional()
  readonly date: string;
}
