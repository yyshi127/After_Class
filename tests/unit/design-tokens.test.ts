import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

type TokenMap = { [key: string]: string | TokenMap };

type TailwindDesignConfig = {
  theme: {
    extend: {
      colors: TokenMap;
      borderRadius: Record<string, string>;
      fontFamily: Record<string, string[]>;
    };
  };
};

const tailwindConfig = (await import('../../tailwind.config.js')).default as unknown as TailwindDesignConfig;
const globalsCss = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');

const tokenGroup = (value: string | TokenMap) => value as TokenMap;

const extractedDemoTokens = {
  primary: '#7C9EB2',
  secondary: '#B8A9C9',
  accent: '#F0B7A4',
  mint: '#A8D5BA',
  peach: '#FFDAB9',
  lavender: '#E6E6FA',
  surface: '#F0F4F8',
  surfaceAlt: '#E8EEF4',
  surfaceCard: '#F0F4F8',
  surfaceDark: '#4A5568',
  text: '#2D3748',
  textMuted: '#718096',
  textSubtle: '#A0AEC0',
  primaryDeep: '#5F8398',
  danger: '#E57373',
  success: '#6FAF8C',
};

describe('M8-01 design token contract', () => {
  it('maps the mental-health demo palette into Tailwind theme tokens', () => {
    const colors = tailwindConfig.theme.extend.colors;

    expect(tokenGroup(colors.primary).DEFAULT).toBe(extractedDemoTokens.primary);
    expect(tokenGroup(colors.secondary).DEFAULT).toBe(extractedDemoTokens.secondary);
    expect(tokenGroup(colors.accent).DEFAULT).toBe(extractedDemoTokens.accent);
    expect(colors.mint).toBe(extractedDemoTokens.mint);
    expect(colors.peach).toBe(extractedDemoTokens.peach);
    expect(colors.lavender).toBe(extractedDemoTokens.lavender);
    expect(tokenGroup(colors.surface).DEFAULT).toBe(extractedDemoTokens.surface);
    expect(tokenGroup(colors.surface).alt).toBe(extractedDemoTokens.surfaceAlt);
    expect(tokenGroup(colors.surface).card).toBe(extractedDemoTokens.surfaceCard);
    expect(tokenGroup(colors.surface).dark).toBe(extractedDemoTokens.surfaceDark);
    expect(tokenGroup(colors.text).DEFAULT).toBe(extractedDemoTokens.text);
    expect(tokenGroup(colors.text).muted).toBe(extractedDemoTokens.textMuted);
    expect(tokenGroup(colors.text).subtle).toBe(extractedDemoTokens.textSubtle);
    expect(tokenGroup(colors.primary).deep).toBe(extractedDemoTokens.primaryDeep);
    expect(tokenGroup(colors.danger).DEFAULT).toBe(extractedDemoTokens.danger);
    expect(tokenGroup(colors.success).DEFAULT).toBe(extractedDemoTokens.success);
  });

  it('exposes CSS variables and neumorphic shadows used by the UI design稿', () => {
    expect(globalsCss).toContain('--color-primary: #7C9EB2;');
    expect(globalsCss).toContain('--color-secondary: #B8A9C9;');
    expect(globalsCss).toContain('--color-accent: #F0B7A4;');
    expect(globalsCss).toContain('--color-bg-dark: #4A5568;');
    expect(globalsCss).toContain('--color-text-subtle: #A0AEC0;');
    expect(globalsCss).toContain('--shadow-light: -8px -8px 20px rgba(255, 255, 255, 0.8);');
    expect(globalsCss).toContain('--shadow-dark: 8px 8px 20px rgba(163, 177, 198, 0.5);');
    expect(globalsCss).toContain('--shadow: var(--shadow-light), var(--shadow-dark);');
    expect(globalsCss).toContain('linear-gradient(135deg, #f8fbff 0%, #eef7f7 52%, #f7f2ff 100%)');
  });

  it('keeps radius and font tokens aligned with the accepted design稿', () => {
    expect(tailwindConfig.theme.extend.borderRadius.neu).toBe('24px');
    expect(tailwindConfig.theme.extend.borderRadius['neu-md']).toBe('20px');
    expect(tailwindConfig.theme.extend.borderRadius['neu-sm']).toBe('16px');
    expect(tailwindConfig.theme.extend.fontFamily.heading).toEqual([
      'Quicksand',
      'Noto Sans SC',
      'sans-serif',
    ]);
    expect(tailwindConfig.theme.extend.fontFamily.body).toEqual([
      'Nunito',
      'Noto Sans SC',
      'PingFang SC',
      'sans-serif',
    ]);
  });
});
