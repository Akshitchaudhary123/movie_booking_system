import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../../users/repositories/user.repository';
import { CreateUserData } from '../../users/types/user.type';
import { PASSWORD } from '../../users/constants/user.constants';
import { USER_ERRORS } from '../../users/constants/user.errors';
import { AUTH_ERRORS } from '../constants/auth.constants';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { TokenService, Tokens } from './token.service';
import { RoleService } from 'src/modules/roles/roles.service';
import { UserService } from 'src/modules/users/users.service';

export interface AuthUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUserResponse;
  tokens: Tokens;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly roleService:RoleService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = dto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(USER_ERRORS.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD.SALT_ROUNDS);

    const customerRole = await this.roleService.getByName('CUSTOMER');

    if (!customerRole) {
      throw new Error('CUSTOMER role not configured');
    }
    

    const createUserData: CreateUserData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId:customerRole.id
    };

    const user = await this.userService.create(createUserData);

    const tokens = this.tokenService.generateTokens(user.id);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.toUserResponse(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const tokens = this.tokenService.generateTokens(user.id);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.toUserResponse(user),
      tokens,
    };
  }

  async refresh(dto: RefreshTokenDto): Promise<Tokens> {
    const { refreshToken } = dto;

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    const tokens = this.tokenService.generateTokens(payload.sub);
    await this.tokenService.storeRefreshToken(payload.sub, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(userId);
  }

  async me(userId: string): Promise<AuthUserResponse> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
    }

    return this.toUserResponse(user);
  }

  private toUserResponse(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }): AuthUserResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}