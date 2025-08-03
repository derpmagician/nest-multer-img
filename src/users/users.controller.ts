// src\users\users.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Query, ValidationPipe, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ message: string; user: Partial<User> }> {
    const user = await this.usersService.create(createUserDto);
    
    // No devolver la contraseña
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto): Promise<{ message: string; user: Partial<User> }> {
    const user = await this.usersService.validateUser(loginUserDto.email, loginUserDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // No devolver la contraseña
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'Login exitoso',
      user: userWithoutPassword
    };
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('check-email')
  async checkEmailAvailability(@Query('email') email: string): Promise<{ available: boolean }> {
    const available = await this.usersService.checkEmailAvailability(email);
    return { available };
  }

  @Get('check-username')
  async checkUsernameAvailability(@Query('username') username: string): Promise<{ available: boolean }> {
    const available = await this.usersService.checkUsernameAvailability(username);
    return { available };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id);
  }
}