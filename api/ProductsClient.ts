import type { APIRequestContext, APIResponse } from '@playwright/test';
import { DUMMYJSON_BASE_URL } from './constants';

type ListParams = {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}

  list(params: ListParams = {}): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/products`, { params });
  }

  getById(id: number | string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/products/${id}`);
  }

  search(q: string, params: ListParams = {}): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/products/search`, { params: { q, ...params } });
  }

  categories(): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/products/categories`);
  }

  byCategory(slug: string, params: ListParams = {}): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/products/category/${slug}`, { params });
  }

  add(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(`${DUMMYJSON_BASE_URL}/products/add`, { data: payload });
  }

  update(id: number | string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.put(`${DUMMYJSON_BASE_URL}/products/${id}`, { data: payload });
  }

  delete(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${DUMMYJSON_BASE_URL}/products/${id}`);
  }
}
