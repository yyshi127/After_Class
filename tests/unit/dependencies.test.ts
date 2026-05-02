import { describe, expect, it } from 'vitest';

const requiredRuntime = ['next', 'react', 'react-dom', '@prisma/client', 'zod'];
const requiredDevRuntime = ['vitest', 'playwright', 'typescript', 'tailwindcss'];

describe('development dependency smoke check', () => {
  it('can resolve core runtime packages', () => {
    for (const packageName of requiredRuntime) {
      expect(() => require.resolve(packageName)).not.toThrow();
    }
  });

  it('can resolve core development packages', () => {
    for (const packageName of requiredDevRuntime) {
      expect(() => require.resolve(packageName)).not.toThrow();
    }
  });
});
