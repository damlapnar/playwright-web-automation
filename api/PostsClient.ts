import type { APIRequestContext, APIResponse } from '@playwright/test';
import { JSONPLACEHOLDER_BASE_URL } from './constants';

export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  list(params: { userId?: number; _limit?: number; _page?: number } = {}): Promise<APIResponse> {
    return this.request.get(`${JSONPLACEHOLDER_BASE_URL}/posts`, { params });
  }

  getById(id: number | string): Promise<APIResponse> {
    return this.request.get(`${JSONPLACEHOLDER_BASE_URL}/posts/${id}`);
  }

  comments(postId: number | string): Promise<APIResponse> {
    return this.request.get(`${JSONPLACEHOLDER_BASE_URL}/posts/${postId}/comments`);
  }

  create(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(`${JSONPLACEHOLDER_BASE_URL}/posts`, { data: payload });
  }

  update(id: number | string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.put(`${JSONPLACEHOLDER_BASE_URL}/posts/${id}`, { data: payload });
  }

  patch(id: number | string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.patch(`${JSONPLACEHOLDER_BASE_URL}/posts/${id}`, { data: payload });
  }

  delete(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${JSONPLACEHOLDER_BASE_URL}/posts/${id}`);
  }
}
