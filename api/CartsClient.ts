import type { APIRequestContext, APIResponse } from '@playwright/test';
import { DUMMYJSON_BASE_URL } from './constants';

type CartProduct = { id: number; quantity: number };

export class CartsClient {
  constructor(private readonly request: APIRequestContext) {}

  list(params: { limit?: number; skip?: number } = {}): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/carts`, { params });
  }

  getById(id: number | string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/carts/${id}`);
  }

  byUser(userId: number | string): Promise<APIResponse> {
    return this.request.get(`${DUMMYJSON_BASE_URL}/carts/user/${userId}`);
  }

  add(userId: number, products: CartProduct[]): Promise<APIResponse> {
    return this.request.post(`${DUMMYJSON_BASE_URL}/carts/add`, { data: { userId, products } });
  }

  update(id: number | string, products: CartProduct[]): Promise<APIResponse> {
    return this.request.put(`${DUMMYJSON_BASE_URL}/carts/${id}`, {
      data: { merge: true, products },
    });
  }

  delete(id: number | string): Promise<APIResponse> {
    return this.request.delete(`${DUMMYJSON_BASE_URL}/carts/${id}`);
  }
}
