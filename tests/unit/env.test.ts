import { loadEnv } from '../../src/config/env';
import { TEST_ENV } from '../helpers/buildTestApp';

describe('loadEnv', () => {
  it('maps a valid environment to the typed, frozen config', () => {
    const config = loadEnv({ ...TEST_ENV, CORS_ORIGINS: 'http://localhost:3000, https://app.example.com', TRUST_PROXY: 'true' });
    expect(config.nodeEnv).toBe('test');
    expect(config.port).toBe(4000);
    expect(config.trustProxy).toBe(true);
    expect(config.cookies.secure).toBe(false);
    expect(config.cors.origins).toEqual(['http://localhost:3000', 'https://app.example.com']);
    expect(config.jwt.accessTtl).toBe('15m');
    expect(Object.isFrozen(config)).toBe(true);
  });

  it('applies the defaults of docs/configuration.md for optional variables', () => {
    const optional = ['PORT', 'NODE_ENV', 'LOG_LEVEL', 'REQUEST_BODY_LIMIT', 'TRUST_PROXY', 'COOKIE_SECURE', 'JWT_ACCESS_TTL', 'JWT_REFRESH_TTL'];
    const rest = Object.fromEntries(Object.entries(TEST_ENV).filter(([key]) => !optional.includes(key)));
    const config = loadEnv(rest);
    expect(config.port).toBe(4000);
    expect(config.nodeEnv).toBe('development');
    expect(config.logLevel).toBe('info');
    expect(config.requestBodyLimit).toBe('100kb');
    expect(config.trustProxy).toBe(false);
    expect(config.cookies.secure).toBe(false);
    expect(config.jwt.accessTtl).toBe('15m');
    expect(config.jwt.refreshTtl).toBe('7d');
  });

  it.each([
    [{ JWT_ACCESS_TTL: '16m' }, 'JWT_ACCESS_TTL'],
    [{ JWT_ACCESS_TTL: '1h' }, 'JWT_ACCESS_TTL'],
    [{ JWT_REFRESH_SECRET: TEST_ENV.JWT_ACCESS_SECRET }, 'JWT_REFRESH_SECRET'],
    [{ CORS_ORIGINS: ' , ' }, 'CORS_ORIGINS'],
  ])('rejects %j', (override, key) => {
    expect(() => loadEnv({ ...TEST_ENV, ...override })).toThrow(key);
  });

  it('throws one readable error naming every invalid key, never echoing the values', () => {
    const secret = 'short-secret-value';
    let message = '';
    try {
      loadEnv({ ...TEST_ENV, JWT_ACCESS_SECRET: secret, COOKIE_SECURE: 'yes', DATABASE_URL: 'mysql://x', NODE_ENV: 'staging' });
    } catch (err) {
      message = (err as Error).message;
    }
    expect(message).toContain('Invalid environment configuration');
    for (const key of ['JWT_ACCESS_SECRET', 'COOKIE_SECURE', 'DATABASE_URL', 'NODE_ENV']) {
      expect(message).toContain(key);
    }
    expect(message).not.toContain(secret);
    expect(message).not.toContain('mysql://x');
  });
});
