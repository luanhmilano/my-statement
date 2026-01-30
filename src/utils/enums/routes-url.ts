export const RoutesUrls = {
  BASE_URL: '/',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;

export type RouteUrl = (typeof RoutesUrls)[keyof typeof RoutesUrls];
