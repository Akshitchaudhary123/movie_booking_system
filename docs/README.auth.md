# Movie Booking System - Authentication Module

A production-ready authentication system built with **NestJS**, **Prisma**, **PostgreSQL**, **Redis**, and **JWT**. This README provides an in-depth explanation of every piece of code in the authentication module — **what it does**, **why we use it**, and **what happens if we don't use it**.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Authentication Flow Overview](#authentication-flow-overview)
4. [Deep Dive: Every File Explained](#deep-dive-every-file-explained)
   - [Auth Module](#1-authmodulets)
   - [Auth Controller](#2-authcontrollerts)
   - [Auth Service](#3-authservicets)
   - [Token Service](#4-tokenservicets)
   - [JWT Strategy](#5-jwtstrategts)
   - [JWT Auth Guard](#6-jwt-authguardts)
   - [Current User Decorator](#7-current-userdecoratorts)
   - [DTOs (Data Transfer Objects)](#8-dtos)
   - [Constants](#9-constants)
5. [Security Considerations](#security-considerations)
6. [Environment Variables](#environment-variables)
7. [Postman Collection](#postman-collection)
8. [Setup & Run](#setup--run)
9. [API Reference](#api-reference)

---

## Tech Stack

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **NestJS** | Application framework | Provides modular architecture, dependency injection, decorators, and built-in support for guards, pipes, and interceptors |
| **Prisma ORM** | Database access | Type-safe database queries with auto-generated TypeScript types |
| **PostgreSQL** | Primary database | Reliable, ACID-compliant relational database for user data |
| **Redis** | In-memory cache/token store | Ultra-fast read/write for refresh token storage and revocation |
| **JWT (JSON Web Tokens)** | Authentication tokens | Stateless authentication — no server-side session storage needed |
| **bcrypt** | Password hashing | Industry-standard one-way hashing with salt to prevent rainbow table attacks |
| **Passport** | Authentication middleware | Battle-tested authentication strategies for Node.js |
| **class-validator** | Request validation | Declarative DTO validation with decorators |

---

## Project Structure

```
src/modules/auth/
├── auth.module.ts              # Module wiring - imports, providers, exports
├── auth.controller.ts          # HTTP route handlers
├── constants/
│   ├── auth.constants.ts       # JWT expiry & error messages
│   └── auth-cache.constants.ts # Redis cache keys & TTLs
├── decorators/
│   └── current-user.decorator.ts  # Extracts authenticated user from request
├── dto/
│   ├── register.dto.ts         # Registration request validation
│   ├── login.dto.ts            # Login request validation
│   └── refresh-token.dto.ts    # Refresh token request validation
├── guards/
│   └── jwt-auth.guard.ts       # Protects routes with JWT authentication
├── services/
│   ├── auth.service.ts         # Business logic for all auth operations
│   └── token.service.ts        # JWT generation, storage, verification
└── strategies/
    └── jwt.strategy.ts         # Passport JWT validation strategy
```

---

## Authentication Flow Overview

```
┌─────────┐     POST /auth/register      ┌──────────────┐
│ Client  │ ───────────────────────────► │ AuthController│
└─────────┘                              └──────┬───────┘
                                                │
                                                ▼
                                        ┌──────────────┐
                                        │  AuthService  │
                                        └──────┬───────┘
                                               │
                        ┌──────────────────────┼──────────────────────┐
                        ▼                      ▼                      ▼
                ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                │ UserRepository│      │  bcrypt.hash │      │ TokenService  │
                │  (Prisma)     │      │  (password)  │      │  (JWT + Redis)│
                └──────────────┘      └──────────────┘      └──────────────┘
                        │                                        │
                        ▼                                        ▼
                ┌──────────────┐                        ┌──────────────┐
                │  PostgreSQL   │                        │    Redis     │
                │  (users table)│                        │ (refresh token)│
                └──────────────┘                        └──────────────┘
```

---

## Deep Dive: Every File Explained

### 1. `auth.module.ts`

```typescript
@Module({
  imports: [
    UsersModule,                    // Provides UserRepository
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),         // Provides JwtService
    ConfigModule,                   // Provides ConfigService
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
```

**What it does:** Wires together all dependencies needed by the auth module.

**Why we use it:**
- **`UsersModule`** — Provides the `UserRepository` abstraction. Without it, `AuthService` couldn't access the database to check for existing users or create new ones.
- **`PassportModule`** — Registers Passport with JWT as the default strategy. Without it, `JwtAuthGuard` wouldn't know which strategy to use.
- **`JwtModule`** — Provides the `JwtService` used to sign and verify tokens. Without it, we'd have to manually implement JWT signing with `jsonwebtoken` library.
- **`ConfigModule`** — Provides `ConfigService` to read environment variables. Without it, JWT secrets would be hardcoded — a major security risk.

**What if we don't use it:**
- Without `UsersModule`: `AuthService` would have no way to query users — registration and login would be impossible.
- Without `PassportModule`: The `JwtAuthGuard` would fail with "Unknown authentication strategy" error.
- Without `JwtModule`: We'd need to manually implement JWT signing/verification, increasing code complexity and risk of security bugs.
- Without `ConfigModule`: JWT secrets would be hardcoded in source code, exposing them in version control.

---

### 2. `auth.controller.ts`

```typescript
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto): Promise<Tokens> {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser('id') userId: string) {
    await this.authService.logout(userId);
    return { message: 'Successfully logged out' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser): Promise<AuthUserResponse> {
    return this.authService.me(user.id);
  }
}
```

**What it does:** Defines HTTP endpoints and delegates business logic to `AuthService`.

**Why we use it:**
- **`@Controller('auth')`** — Sets the base route prefix. All endpoints are under `/auth`.
- **`@Post('register')`** — Maps HTTP POST requests to the handler. Returns `201 Created` status.
- **`@UseGuards(JwtAuthGuard)`** — Protects routes. Only requests with a valid Bearer token can access `logout` and `me`.
- **`@CurrentUser()`** — Custom decorator that extracts the authenticated user from the request object (populated by Passport).
- **`@Body() dto`** — Automatically validates and transforms the request body using the DTO class.

**What if we don't use it:**
- Without `@UseGuards`: Anyone could call `logout` or `me` without authentication — a critical security vulnerability.
- Without `@Body() dto`: Request data would be unvalidated — malformed or malicious input could crash the app or cause SQL injection.
- Without `@HttpCode`: NestJS defaults POST to `201`, but login/refresh should return `200` — incorrect status codes confuse API consumers.

---

### 3. `auth.service.ts`

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // 1. Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(USER_ERRORS.EMAIL_ALREADY_EXISTS);
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, PASSWORD.SALT_ROUNDS);

    // 3. Create the user
    const user = await this.userRepository.create(createUserData);

    // 4. Generate tokens and store refresh token
    const tokens = this.tokenService.generateTokens(user.id);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);

    return { user: this.toUserResponse(user), tokens };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // 3. Generate tokens
    const tokens = this.tokenService.generateTokens(user.id);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);

    return { user: this.toUserResponse(user), tokens };
  }

  async refresh(dto: RefreshTokenDto): Promise<Tokens> {
    // Verify refresh token is valid and matches stored token
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    // Generate new tokens (rotation)
    const tokens = this.tokenService.generateTokens(payload.sub);
    await this.tokenService.storeRefreshToken(payload.sub, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    // Revoke refresh token from Redis
    await this.tokenService.revokeRefreshToken(userId);
  }

  async me(userId: string): Promise<AuthUserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
    }
    return this.toUserResponse(user);
  }
}
```

**What it does:** Contains all business logic for authentication operations.

**Why we use it:**
- **Repository Pattern** — `AuthService` depends on the abstract `UserRepository`, not the concrete Prisma implementation. This makes the code testable (mock the repository) and swappable (change database without changing service logic).
- **`bcrypt.hash(password, 12)`** — One-way hashing with 12 salt rounds. Even if the database is compromised, passwords can't be recovered.
- **`bcrypt.compare()`** — Constant-time comparison to prevent timing attacks.
- **`ConflictException`** — Returns `409 Conflict` when email already exists, which is semantically correct.
- **`UnauthorizedException`** — Returns `401 Unauthorized` for invalid credentials. We use the same error message for both "user not found" and "wrong password" to prevent user enumeration.
- **`toUserResponse()`** — Strips the password hash from the response. Never expose password hashes to clients.

**What if we don't use it:**
- **Without repository pattern:** `AuthService` would directly use Prisma, making unit testing nearly impossible and tightly coupling business logic to the database.
- **Without bcrypt:** Storing plain-text passwords is catastrophic. If the database leaks, all user accounts are compromised.
- **Without `ConflictException`:** Returning `200 OK` for duplicate emails would confuse clients and make error handling ambiguous.
- **Without stripping password:** Exposing password hashes in API responses is a severe security vulnerability.
- **Without token rotation on refresh:** If a refresh token is stolen, it remains valid forever (until 7-day expiry), allowing attackers to maintain access.

---

### 4. `token.service.ts`

```typescript
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  generateTokens(userId: string): Tokens {
    const payload: TokenPayload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: JWT.ACCESS_TOKEN_EXPIRES_IN,  // '15m'
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: JWT.REFRESH_TOKEN_EXPIRES_IN,  // '7d'
    });

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = AUTH_CACHE_KEYS.REFRESH_TOKEN(userId);
    await this.redisService.getClient().set(
      key, refreshToken, 'EX', AUTH_CACHE_TTL.REFRESH_TOKEN
    );
  }

  async verifyRefreshToken(refreshToken: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      // Check if the token matches what's stored in Redis
      const storedToken = await this.redisService
        .getClient()
        .get(AUTH_CACHE_KEYS.REFRESH_TOKEN(payload.sub));

      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    const key = AUTH_CACHE_KEYS.REFRESH_TOKEN(userId);
    await this.redisService.getClient().del(key);
  }
}
```

**What it does:** Handles all JWT token operations — generation, storage, verification, and revocation.

**Why we use it:**
- **Separate secrets for access & refresh tokens** — If the access token secret is compromised, refresh tokens remain secure (and vice versa). This is defense in depth.
- **Short-lived access tokens (15m)** — Limits the window of exposure if a token is stolen. Even if an attacker gets an access token, it expires quickly.
- **Long-lived refresh tokens (7d)** — Allows users to stay logged in without re-entering credentials, while still requiring periodic re-authentication.
- **Redis storage for refresh tokens** — Enables server-side revocation. Without this, a stolen refresh token would remain valid until expiry.
- **Token rotation** — Every refresh generates a new refresh token and invalidates the old one. This prevents replay attacks.
- **`getOrThrow`** — Fails fast if JWT secrets are missing from environment variables, preventing the app from running insecurely.

**What if we don't use it:**
- **Without separate secrets:** A single compromised secret would allow attackers to forge both access and refresh tokens.
- **Without short-lived access tokens:** A stolen access token would grant access for 7 days instead of 15 minutes.
- **Without Redis storage:** Logout would be meaningless — refresh tokens would remain valid until natural expiry. There would be no way to revoke access.
- **Without token rotation:** A stolen refresh token could be used repeatedly to generate new access tokens.
- **Without `getOrThrow`:** If secrets are missing, the app would either crash at runtime with confusing errors or use insecure defaults.

---

### 5. `jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
```

**What it does:** Validates the JWT access token and loads the user from the database.

**Why we use it:**
- **`ExtractJwt.fromAuthHeaderAsBearerToken()`** — Extracts the token from the `Authorization: Bearer <token>` header, the standard convention.
- **`ignoreExpiration: false`** — Rejects expired tokens. Without this, expired tokens would still be accepted.
- **`validate()`** — Runs after JWT signature verification. It checks that the user still exists in the database. This is critical because:
  - If a user is deleted, their token should no longer work.
  - If a user is deactivated, their token should be invalidated.
- **Returns user object** — This gets attached to `request.user`, which the `@CurrentUser()` decorator reads.

**What if we don't use it:**
- **Without `ignoreExpiration: false`:** Expired tokens would grant access indefinitely — a critical security flaw.
- **Without `validate()` checking the database:** Deleted or deactivated users could still access protected routes with valid tokens.
- **Without returning user data:** Controllers would have to re-query the database for user info on every request, adding unnecessary latency.

---

### 6. `jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**What it does:** A thin wrapper around Passport's JWT authentication guard.

**Why we use it:**
- **Reusability** — Instead of writing `@UseGuards(AuthGuard('jwt'))` everywhere, we define a named guard. This makes the code more readable and allows us to add custom logic (e.g., logging, rate limiting) in one place.
- **Consistency** — All protected routes use the same guard, ensuring uniform authentication behavior.

**What if we don't use it:**
- Without a named guard, we'd have to repeat `@UseGuards(AuthGuard('jwt'))` on every protected route. If we needed to change authentication behavior, we'd have to update every route.

---

### 7. `current-user.decorator.ts`

```typescript
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;
    return data ? user?.[data] : user;
  },
);
```

**What it does:** Extracts the authenticated user (or a specific field) from the request.

**Why we use it:**
- **Clean code** — Controllers can simply use `@CurrentUser()` instead of manually accessing `request.user`.
- **Flexibility** — Supports both `@CurrentUser()` (returns full user) and `@CurrentUser('id')` (returns just the ID).
- **Type safety** — Returns typed `AuthenticatedUser` objects.

**What if we don't use it:**
- Without it, every controller would need to manually access `request.user`, leading to repetitive, error-prone code.

---

### 8. DTOs (Data Transfer Objects)

#### `register.dto.ts`
```typescript
export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() firstName!: string;
  @IsString() lastName!: string;
}
```

#### `login.dto.ts`
```typescript
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}
```

#### `refresh-token.dto.ts`
```typescript
export class RefreshTokenDto {
  @IsString() @MinLength(1) refreshToken!: string;
}
```

**What they do:** Define the shape and validation rules for request bodies.

**Why we use them:**
- **Validation** — `class-validator` decorators automatically validate incoming data. Invalid requests get `400 Bad Request` responses.
- **Whitelist** — The global `ValidationPipe` with `whitelist: true` strips unknown properties, preventing mass-assignment attacks.
- **Type safety** — TypeScript types ensure the correct data shape at compile time.

**What if we don't use them:**
- **Without validation:** Malformed data could crash the app, cause SQL injection, or allow attackers to inject unexpected fields (e.g., setting `isAdmin: true`).
- **Without `@MinLength(8)`:** Users could set weak passwords like "123", compromising account security.
- **Without `@IsEmail()`:** Invalid email formats would be stored in the database, breaking email-based features.

---

### 9. Constants

#### `auth.constants.ts`
```typescript
export const JWT = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
} as const;

export const AUTH_ERRORS = {
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
} as const;
```

#### `auth-cache.constants.ts`
```typescript
export const AUTH_CACHE_KEYS = {
  REFRESH_TOKEN: (userId: string) => `auth:refresh-token:${userId}`,
  REFRESH_TOKEN_BLACKLIST: (token: string) => `auth:blacklist:${token}`,
} as const;

export const AUTH_CACHE_TTL = {
  REFRESH_TOKEN: 60 * 60 * 24 * 7, // 7 days in seconds
  REFRESH_TOKEN_BLACKLIST: 60 * 60 * 24 * 7,
} as const;
```

**What they do:** Centralize configuration values and error messages.

**Why we use them:**
- **Single source of truth** — Change token expiry in one place, not scattered across the codebase.
- **Consistent error messages** — Same error message everywhere, making API responses predictable.
- **`as const`** — Makes values immutable and provides literal types for better type safety.

**What if we don't use them:**
- **Without constants:** Hardcoded values scattered across files make maintenance a nightmare. Changing token expiry would require searching through the entire codebase.
- **Without centralized errors:** Different error messages for the same error would confuse API consumers and make testing harder.

---

## Security Considerations

| Security Measure | Why It's Critical |
|-----------------|-------------------|
| **bcrypt password hashing** | Prevents password recovery from database leaks |
| **12 salt rounds** | Makes brute-force attacks computationally expensive |
| **Separate JWT secrets** | Limits damage if one secret is compromised |
| **Short-lived access tokens (15m)** | Minimizes exposure window for stolen tokens |
| **Refresh token rotation** | Prevents replay attacks with stolen refresh tokens |
| **Redis-based revocation** | Enables server-side logout |
| **Same error for user-not-found & wrong-password** | Prevents user enumeration attacks |
| **DTO validation with whitelist** | Prevents mass-assignment and injection attacks |
| **Password never returned in responses** | Prevents credential exposure |
| **`getOrThrow` for secrets** | Fails fast if security config is missing |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `REDIS_HOST` | Redis host | ✅ |
| `REDIS_PORT` | Redis port | ✅ |
| `REDIS_PASSWORD` | Redis password | ✅ |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | ✅ |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | ✅ |
| `PORT` | Application port (default: 3000) | ❌ |
| `API_PREFIX` | Global API prefix (default: `api/v1`) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |

---

## Postman Collection

A complete Postman collection is included at `postman/auth-collection.json`.

### How to Import
1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `postman/auth-collection.json`
4. The collection will appear with all 5 auth endpoints

### Collection Features
- **Collection Variables:** `baseUrl`, `accessToken`, `refreshToken` are automatically managed
- **Test Scripts:** Each request has automated tests that verify responses
- **Auto Token Storage:** After register/login, tokens are automatically saved to collection variables
- **Protected Routes:** Logout and Me automatically use the stored access token

### Suggested Test Flow
1. **Register** → Creates a user, stores tokens
2. **Login** → Logs in, refreshes stored tokens
3. **Me** → Gets current user profile (uses stored access token)
4. **Refresh** → Gets new tokens, updates stored tokens
5. **Logout** → Revokes refresh token

---

## Setup & Run

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- npm

### 1. Install Dependencies
```bash
cd movie-booking-system
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database, Redis, and JWT secrets
```

### 3. Set Up Database
```bash
npx prisma migrate dev --name init
```

### 4. Start Redis & PostgreSQL
```bash
docker-compose up -d
```

### 5. Run the Application
```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 6. Access Swagger Docs
```
http://localhost:3000/api/v1/docs
```

---

## API Reference

### `POST /api/v1/auth/register`
Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "clx...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "tokens": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

### `POST /api/v1/auth/login`
Login with credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):** Same shape as register.

### `POST /api/v1/auth/refresh`
Refresh tokens using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

### `POST /api/v1/auth/logout`
Logout and revoke refresh token. **Requires Bearer token.**

**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

### `GET /api/v1/auth/me`
Get current user profile. **Requires Bearer token.**

**Response (200):**
```json
{
  "id": "clx...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

---

## License

MIT