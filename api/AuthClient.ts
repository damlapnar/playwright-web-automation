import type { APIRequestContext, APIResponse } from '@playwright/test';
import { DUMMYJSON_BASE_URL } from './constants';

// Wraps dummyjson's JWT auth flow. Kept separate from the resource clients
// (Users/Products/Carts) since those endpoints don't actually require a
// token — only /auth/me does.
export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  login(username: string, password: string, expiresInMins?: number): Promise<APIResponse> {
    return this.request.post(`${DUMMYJSON_BASE_URL}/auth/login`, {
      data: { username, password, ...(expiresInMins ? { expiresInMins } : {}) },
    });
  }

  me(token?: string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/auth/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  refresh(refreshToken: string, expiresInMins?: number): Promise<APIResponse> {
    return this.request.post(`${DUMMYJSON_BASE_URL}/auth/refresh`, {
      data: { refreshToken, ...(expiresInMins ? { expiresInMins } : {}) },
    });
  }
}
