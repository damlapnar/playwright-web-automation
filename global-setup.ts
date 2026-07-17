import type { FullConfig } from '@playwright/test';

// Fails fast with one clear error instead of every test in the run timing
// out individually against an unreachable target.
async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL;
  if (!baseURL) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(baseURL, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`${baseURL} responded with ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Global setup: ${baseURL} is unreachable (${reason}). Aborting before running any tests.`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export default globalSetup;
