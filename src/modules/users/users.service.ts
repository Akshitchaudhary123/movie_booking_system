import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserData } from './types/user.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserData) {
    return this.userRepository.create(data);
  }

  async findByIdWithRole(id: string) {
    return this.userRepository.findByIdWithRole(id);
  }
}