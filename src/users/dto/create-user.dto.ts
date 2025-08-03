import { IsEmail, IsString, IsOptional, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, { message: 'First name can only contain letters and spaces' })
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, { message: 'Last name can only contain letters and spaces' })
  lastName: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, hyphens and underscores' })
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, { 
    message: 'Password must contain at least 8 characters with uppercase, lowercase and number' 
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;

  @IsOptional()
  @IsBoolean()
  newsletterSubscription?: boolean;

  @IsBoolean()
  termsAccepted: boolean;
}