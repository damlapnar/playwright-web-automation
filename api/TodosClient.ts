import type { APIRequestContext, APIResponse } from '@playwright/test';
import { DUMMYJSON_BASE_URL } from './constants';

type ListParams = {
  limit?: number;
  skip?: number;
};

export class TodosClient {
  constructor(private readonly request: APIRequestContext) {}

  list(params: ListParams = {}): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/todos`, { params });
  }

  getById(id: number | string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/todos/${id}`);
  }

  random(): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/todos/random`);
  }

  byUser(userId: number | string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/todos/user/${userId}`);
  }

  add(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(`${DUMMYJSON_BASE_URL}/todos/add`, { data: payload });
  }

  update(id: number | string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.put(`${DUMMYJSON_BASE_URL}/todos/${id}`, { data: payload });
  }

  delete(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${DUMMYJSON_BASE_URL}/todos/${id}`);
  }
}
