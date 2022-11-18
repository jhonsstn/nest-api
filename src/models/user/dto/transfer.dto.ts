import { IsNumber, IsString, IsUUID } from 'class-validator';

export class TransferDto {
  @IsString()
  @IsUUID()
  cashInId: string;

  @IsNumber()
  amount: number;
}
