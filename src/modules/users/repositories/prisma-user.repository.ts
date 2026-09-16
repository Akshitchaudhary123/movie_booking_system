import { Injectable } from "@nestjs/common";
import { User,Role } from "@prisma/client";
import { UserRepository } from "./user.repository";
import { CreateUserData } from "../types/user.type";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByIdWithRole(
  id: string,
): Promise<(User & { role: Role }) | null> {
  return this.prisma.prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });
}
}