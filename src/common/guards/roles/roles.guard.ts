import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // const requiredRoles = this.reflector.get<string[]>(
    //   'roles',
    //   context.getHandler(),
    // );

  const requiredRoles = this.reflector.getAllAndOverride<string[]>(
  'roles',
  [context.getHandler(), context.getClass()],
);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return requiredRoles.includes(user.role);
  }
}