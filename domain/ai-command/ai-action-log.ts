import type { AiIntent, RiskLevel, Role } from '@/domain/shared/enums';

export type AiActionResultStatus = 'DRAFTED' | 'CONFIRMATION_REQUIRED' | 'EXECUTED' | 'REJECTED' | 'FAILED';

export type AiActionLogPayload = {
  actorUserId: string;
  actorRole: Role;
  rawInput: string;
  intent: AiIntent | null;
  entities: Record<string, unknown> | null;
  confidence: number;
  risk: RiskLevel;
  confirmationRequired: boolean;
  confirmedAt: Date | null;
  resultStatus: AiActionResultStatus;
  resultSummary: string | null;
  failureReason: string | null;
};

type BuildAiActionLogInput = {
  actorUserId: string;
  actorRole: Role;
  rawInput: string;
  intent?: AiIntent | null;
  entities?: Record<string, unknown> | null;
  confidence: number;
  risk: RiskLevel;
  confirmationRequired: boolean;
  confirmedAt?: Date | null;
  resultStatus: AiActionResultStatus;
  resultSummary?: string | null;
  failureReason?: string | null;
};

type AiActionLoggingInput<T> = {
  base: Omit<BuildAiActionLogInput, 'resultStatus'>;
  execute: () => Promise<T>;
  persist: (payload: AiActionLogPayload) => Promise<void>;
  summarizeResult?: (result: T) => string | null;
};

export function buildAiActionLogPayload(input: BuildAiActionLogInput): AiActionLogPayload {
  return {
    actorUserId: input.actorUserId,
    actorRole: input.actorRole,
    rawInput: input.rawInput,
    intent: input.intent ?? null,
    entities: input.entities ?? null,
    confidence: input.confidence,
    risk: input.risk,
    confirmationRequired: input.confirmationRequired,
    confirmedAt: input.confirmedAt ?? null,
    resultStatus: input.resultStatus,
    resultSummary: input.resultSummary ?? null,
    failureReason: input.failureReason ?? null,
  };
}

export async function withAiActionLogging<T>({
  base,
  execute,
  persist,
  summarizeResult,
}: AiActionLoggingInput<T>): Promise<T> {
  try {
    const result = await execute();
    await persist(
      buildAiActionLogPayload({
        ...base,
        resultStatus: base.confirmationRequired ? 'CONFIRMATION_REQUIRED' : 'EXECUTED',
        resultSummary: summarizeResult?.(result) ?? null,
      }),
    );
    return result;
  } catch (error) {
    await persist(
      buildAiActionLogPayload({
        ...base,
        resultStatus: 'FAILED',
        failureReason: error instanceof Error ? error.message : 'Unknown AI action failure',
      }),
    );
    throw error;
  }
}
