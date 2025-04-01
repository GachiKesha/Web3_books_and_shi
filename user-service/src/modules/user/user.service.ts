import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt'

import { AuthService } from '../auth/auth.service';

import { UserDTO } from './dto';
import { User, Role } from '../../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: UserDTO) {
    const { email, username, role } = dto;
    const salt = await bcrypt.genSalt();
    const userPassword = await bcrypt.hash(dto.password, salt);

    const allowedRoles = ['user', 'admin'];
    if (!allowedRoles.includes(role)) {
      throw new RpcException(`Role ${role} not found`);
    }

    const userData = {
      email,
      username,
      password: userPassword,
      role: role as Role,
    };

    if (await this.findUserByEmail(email)) {
      throw new RpcException(new BadRequestException('Invalid request. Please check your input.'));
    }
    const user = this.userRepository.create(userData);

    const savedUser = await this.userRepository.save(user);

    return this.authService.generateTokens({
      member_id: savedUser.id,
    });
  }

  async login(dto: UserDTO)  {
    const { email, password } = dto;

    const user = await this.findUserByEmail(email);
    const isCorrect = user && await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new RpcException(new UnauthorizedException('Invalid credentials'));
    }
    return this.authService.generateTokens({
      member_id: user.id,
    })
  }

  async findAllUsers() {
    return this.userRepository.find();
  }

  async findUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: string, dto: UserDTO) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new RpcException(new NotFoundException('User not found'));
    }

    const { role, ...updateData } = dto;
    return this.userRepository.save({
      ...user,
      ...updateData,
      ...(role ? { role: role as Role } : {}),
    });
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new RpcException(new NotFoundException('User not found'));
    }
    return this.userRepository.delete(id);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async resetPassword(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new RpcException(new NotFoundException('User not found'));
    }
    return this.userRepository.save({ ...user, password: '123456' });
  }
}
