import { describe, expect, it } from 'vitest';

import { createMockAiProvider, type AiProvider } from '@/domain/ai-command/ai-provider';

describe('AI provider abstraction', () => {
  it('defines generateJson, generateText and analyzeImage methods', async () => {
    const provider: AiProvider = createMockAiProvider({
      json: { intent: 'queryAttendance', confidence: 0.9 },
      text: '今天已到托管中心',
      image: { suggestedAreas: [{ id: 'area-1', confidence: 0.82 }] },
    });

    await expect(provider.generateJson({ prompt: '识别意图', schemaName: 'intent' })).resolves.toEqual({
      intent: 'queryAttendance',
      confidence: 0.9,
    });
    await expect(provider.generateText({ prompt: '生成家长回复' })).resolves.toBe('今天已到托管中心');
    await expect(
      provider.analyzeImage({
        prompt: '识别错题区域',
        imageFileId: 'file-1',
      }),
    ).resolves.toEqual({ suggestedAreas: [{ id: 'area-1', confidence: 0.82 }] });
  });

  it('mock provider records calls for tests without touching external AI services', async () => {
    const provider = createMockAiProvider({ json: { ok: true }, text: 'ok', image: { ok: true } });

    await provider.generateJson({ prompt: 'json prompt' });
    await provider.generateText({ prompt: 'text prompt' });
    await provider.analyzeImage({ prompt: 'image prompt', imageFileId: 'private-file-1' });

    expect(provider.calls).toEqual([
      { method: 'generateJson', input: { prompt: 'json prompt' } },
      { method: 'generateText', input: { prompt: 'text prompt' } },
      { method: 'analyzeImage', input: { prompt: 'image prompt', imageFileId: 'private-file-1' } },
    ]);
  });
});
