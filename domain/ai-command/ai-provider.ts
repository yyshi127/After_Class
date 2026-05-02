export type AiGenerateJsonInput = {
  prompt: string;
  schemaName?: string;
  context?: Record<string, unknown>;
};

export type AiGenerateTextInput = {
  prompt: string;
  context?: Record<string, unknown>;
};

export type AiAnalyzeImageInput = {
  prompt: string;
  imageFileId: string;
  context?: Record<string, unknown>;
};

export type AiProvider = {
  generateJson: (input: AiGenerateJsonInput) => Promise<Record<string, unknown>>;
  generateText: (input: AiGenerateTextInput) => Promise<string>;
  analyzeImage: (input: AiAnalyzeImageInput) => Promise<Record<string, unknown>>;
};

type MockAiProviderFixtures = {
  json: Record<string, unknown>;
  text: string;
  image: Record<string, unknown>;
};

type MockAiProviderCall =
  | { method: 'generateJson'; input: AiGenerateJsonInput }
  | { method: 'generateText'; input: AiGenerateTextInput }
  | { method: 'analyzeImage'; input: AiAnalyzeImageInput };

export type MockAiProvider = AiProvider & {
  calls: MockAiProviderCall[];
};

export function createMockAiProvider(fixtures: MockAiProviderFixtures): MockAiProvider {
  const calls: MockAiProviderCall[] = [];

  return {
    calls,
    async generateJson(input) {
      calls.push({ method: 'generateJson', input });
      return fixtures.json;
    },
    async generateText(input) {
      calls.push({ method: 'generateText', input });
      return fixtures.text;
    },
    async analyzeImage(input) {
      calls.push({ method: 'analyzeImage', input });
      return fixtures.image;
    },
  };
}
