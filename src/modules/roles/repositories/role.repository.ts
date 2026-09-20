
import { Role } from '@prisma/client';

export abstract class RoleRepository {
  abstract findByName(name: string): Promise<Role | null>;

  abstract findById(id: string): Promise<Role | null>;
}
