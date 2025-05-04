import { IsEmail, IsIn, IsString } from 'class-validator';

export class Login {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class User extends Login {
  @IsString()
  username: string;

  @IsIn(['user', 'admin'])
  role: string;
}
