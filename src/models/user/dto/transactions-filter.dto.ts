import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TransactionsFilterDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly operation: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly date: string;
}
