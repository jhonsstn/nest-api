import { IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  readonly username: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, {
    message: 'password must contain at least one lowercase character',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'password must have one uppercase character',
  })
  readonly password: string;
}
