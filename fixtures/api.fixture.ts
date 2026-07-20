import { test as base, request as requestModule, type APIRequestContext } from '@playwright/test';
import { AuthClient } from '@api/AuthClient';
import { UsersClient } from '@api/UsersClient';
import { ProductsClient } from '@api/ProductsClient';
import { CartsClient } from '@api/CartsClient';
import { PostsClient } from '@api/PostsClient';
import { DUMMYJSON_BASE_URL, primaryAuthUser } from '@api/constants';

type ApiClients = {
  authClient: AuthClient;
  usersClient: UsersClient;
  productsClient: ProductsClient;
  cartsClient: CartsClient;
  postsClient: PostsClient;
};

export const apiTest = base.extend<ApiClients>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
  productsClient: async ({ request }, use) => {
    await use(new ProductsClient(request));
  },
  cartsClient: async ({ request }, use) => {
    await use(new CartsClient(request));
  },
  postsClient: async ({ request }, use) => {
    await use(new PostsClient(request));
  },
});

type AuthedFixtures = { accessToken: string };
type WorkerFixtures = { workerAccessToken: string };

// Only /auth/me actually requires a bearer token on dummyjson — the
// resource endpoints (users/products/carts) don't gate on auth at all.
// Logging in once per worker (mirroring fixtures/auth.fixture.ts's
// storageState reuse) avoids every auth-dependent test re-authenticating.
export const authedApiTest = apiTest.extend<AuthedFixtures, WorkerFixtures>({
  workerAccessToken: [
    // Playwright inspects this signature at runtime; it must stay a
    // destructuring pattern even though no fixtures are needed here.
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const context = await requestModule.newContext();
      const res = await context.post(`${DUMMYJSON_BASE_URL}/auth/login`, {
        data: primaryAuthUser,
      });
      const body = await res.json();
      await context.dispose();
      await use(body.accessToken);
    },
    { scope: 'worker' },
  ],

  accessToken: async ({ workerAccessToken }, use) => {
    await use(workerAccessToken);
  },
});

export { expect } from '@playwright/test';
export type { APIRequestContext };
