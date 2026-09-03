

export const USER_CACHE_KEYS = {
  PROFILE: (id: string) => `user:${id}`,
  EMAIL: (email: string) => `user:email:${email}`,
} as const;