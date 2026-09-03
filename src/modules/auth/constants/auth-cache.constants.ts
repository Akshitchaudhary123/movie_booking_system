export const AUTH_CACHE_KEYS = {
  REFRESH_TOKEN: (userId: string) => `auth:refresh-token:${userId}`,
  REFRESH_TOKEN_BLACKLIST: (token: string) => `auth:blacklist:${token}`,
} as const;

export const AUTH_CACHE_TTL = {
  REFRESH_TOKEN: 60 * 60 * 24 * 7, // 7 days in seconds
  REFRESH_TOKEN_BLACKLIST: 60 * 60 * 24 * 7, // 7 days in seconds
} as const;