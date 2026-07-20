import { apiTest, authedApiTest, expect } from '@fixtures/api.fixture';
import { primaryAuthUser } from '@api/constants';

apiTest.describe('API — Auth', () => {
  apiTest('POST /auth/login returns a token pair for valid credentials', async ({ authClient }) => {
    const res = await authClient.login(primaryAuthUser.username, primaryAuthUser.password);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
    expect(typeof body.refreshToken).toBe('string');
    expect(body.username).toBe(primaryAuthUser.username);
  });

  apiTest('POST /auth/login returns 400 for a wrong password', async ({ authClient }) => {
    const res = await authClient.login(primaryAuthUser.username, 'wrong-password');
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBeDefined();
  });

  apiTest('POST /auth/login returns 400 for an unknown username', async ({ authClient }) => {
    const res = await authClient.login('does-not-exist', 'irrelevant');
    expect(res.status()).toBe(400);
  });

  apiTest('POST /auth/login without a password returns 400', async ({ authClient }) => {
    const res = await authClient.login(primaryAuthUser.username, '');
    expect(res.status()).toBe(400);
  });

  apiTest('POST /auth/login rejects a malformed JSON body', async ({ request }) => {
    const res = await request.post('https://dummyjson.com/auth/login', {
      headers: { 'Content-Type': 'application/json' },
      data: '{not valid json',
    });
    expect(res.status()).toBe(400);
  });

  apiTest('POST /auth/login honors expiresInMins on the issued token', async ({ authClient }) => {
    const res = await authClient.login(primaryAuthUser.username, primaryAuthUser.password, 1);
    expect(res.status()).toBe(200);
    const body = await res.json();
    const payload = JSON.parse(Buffer.from(body.accessToken.split('.')[1], 'base64').toString());
    // 1 minute expiry, +/- a few seconds of clock/network slack
    expect(payload.exp - payload.iat).toBeLessThanOrEqual(65);
  });

  apiTest('GET /auth/me without a token returns 401', async ({ authClient }) => {
    const res = await authClient.me();
    expect(res.status()).toBe(401);
  });

  apiTest('GET /auth/me with a garbage token returns 401', async ({ authClient }) => {
    const res = await authClient.me('not-a-real-token');
    expect(res.status()).toBe(401);
  });

  authedApiTest(
    'GET /auth/me with a valid token returns the logged-in user',
    async ({ authClient, accessToken }) => {
      const res = await authClient.me(accessToken);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.username).toBe(primaryAuthUser.username);
      expect(body.email).toContain('@');
    }
  );

  authedApiTest(
    'POST /auth/refresh exchanges a refresh token for a new token pair',
    async ({ authClient }) => {
      const login = await authClient.login(primaryAuthUser.username, primaryAuthUser.password);
      const { refreshToken } = await login.json();

      const refreshed = await authClient.refresh(refreshToken);
      expect(refreshed.status()).toBe(200);
      const body = await refreshed.json();
      expect(typeof body.accessToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(0);

      // The freshly issued access token must itself be usable against /auth/me
      // — this is the real contract, not whether it byte-differs from the
      // original (dummyjson's JWTs are deterministic per second-granularity
      // `iat`, so back-to-back calls can legitimately mint an identical token).
      const me = await authClient.me(body.accessToken);
      expect(me.status()).toBe(200);
    }
  );

  apiTest(
    'POST /auth/refresh with an invalid refresh token returns 403',
    async ({ authClient }) => {
      const res = await authClient.refresh('not-a-real-refresh-token');
      expect(res.status()).toBe(403);
    }
  );
});
