export const RoutesUrls = {
  BASE_URL: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;

export type RouteUrl = (typeof RoutesUrls)[keyof typeof RoutesUrls];