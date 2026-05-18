/**
 * Env-driven settings shared by OpenAPI (`servers`) and runtime (listen port).
 * Import this from `openapi-template` / `server` instead of reading `process.env` in each place.
 */
export function getApiPort(): number {
  const raw = process.env.PORT;
  if (raw === undefined || raw === '') return 5000;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 5000;
}

export function getOpenApiServers(): Array<{ url: string; description: string }> {
  const port = getApiPort();
  const base = process.env.SWAGGER_BASE_URL;
  if (base) {
    return [{ url: base, description: 'API server' }];
  }
  return [
    { url: `http://127.0.0.1:${port}`, description: 'Local (127.0.0.1)' },
    { url: `http://localhost:${port}`, description: 'Local (localhost)' },
  ];
}
