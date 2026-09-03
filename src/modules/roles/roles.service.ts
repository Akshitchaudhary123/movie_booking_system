import { Injectable } from '@nestjs/common';

import { RoleRepository } from './repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
  ) {}

  async getByName(name: string) {
    return this.roleRepository.findByName(name);
  }

  async getById(id: string) {
    return this.roleRepository.findById(id);
  }
}