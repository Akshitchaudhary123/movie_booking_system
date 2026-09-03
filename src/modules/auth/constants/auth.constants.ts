export const JWT = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
} as const;

export const AUTH_ERRORS = {
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
} as const;