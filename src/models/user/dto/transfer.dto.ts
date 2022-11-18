import { IsNumber, IsString, IsUUID } from 'class-validator';

export class TransferDto {
  @IsString()
  @IsUUID()
  creditedId: string;

  @IsNumber()
  amount: number;
}
