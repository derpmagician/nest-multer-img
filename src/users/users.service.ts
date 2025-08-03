import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });
    
    if (existingEmail) {
      throw new ConflictException('Este correo electrónico ya está registrado');
    }

    // Verificar si el username ya existe
    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username }
    });
    
    if (existingUsername) {
      throw new ConflictException('Este nombre de usuario ya está en uso');
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Crear nuevo usuario
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'username', 'country', 'createdAt']
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'username', 'country', 'createdAt']
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email }
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { username }
    });
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email }
    });
    return !user;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { username }
    });
    return !user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}