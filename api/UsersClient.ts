import type { APIRequestContext, APIResponse } from '@playwright/test';
import { DUMMYJSON_BASE_URL } from './constants';

type ListParams = {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export class UsersClient {
  constructor(private readonly request: APIRequestContext) {}

  list(params: ListParams = {}): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/users`, { params });
  }

  getById(id: number | string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/users/${id}`);
  }

  search(q: string, params: ListParams = {}): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/users/search`, { params: { q, ...params } });
  }

  filter(key: string, value: string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/users/filter`, { params: { key, value } });
  }

  add(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(`${DUMMYJSON_BASE_URL}/users/add`, { data: payload });
  }

  update(id: number | string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.put(`${DUMMYJSON_BASE_URL}/users/${id}`, { data: payload });
  }

  patch(id: number | string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.patch(`${DUMMYJSON_BASE_URL}/users/${id}`, { data: payload });
  }

  delete(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${DUMMYJSON_BASE_URL}/users/${id}`);
  }
}
