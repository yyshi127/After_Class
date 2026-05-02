import type { AiIntent, RiskLevel, Role } from '@/domain/shared/enums';

export type ConfirmationRequestStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'EXECUTED';

export type ConfirmationRequestPayload = Record<string, string | number | boolean | null | undefined>;

export type ConfirmationRequest = {
  id: string;
  actorUserId: string;
  actorRole: Role;
  intent: AiIntent;
  risk: Extract<RiskLevel, 'MEDIUM'>;
  rawInput: string;
  payload: ConfirmationRequestPayload;
  summary: string;
  status: ConfirmationRequestStatus;
  confirmationRequired: true;
  cardTitle: string;
  confirmedByUserId: string | null;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
  expiredAt: Date | null;
  executedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type BuildConfirmationRequestInput = {
  id: string;
  actorUserId: string;
  actorRole: Role;
  intent: AiIntent;
  rawInput: string;
  payload: ConfirmationRequestPayload;
  summary: string;
  now: Date;
  expiresAt: Date;
};

type ConfirmRequestInput = {
  confirmedByUserId: string;
  confirmedAt: Date;
};

type ExecutedConfirmationRequest = ConfirmationRequest & {
  status: 'EXECUTED';
  executedAt: Date;
};

export function buildConfirmationRequest(input: BuildConfirmationRequestInput): ConfirmationRequest {
  return {
    id: input.id,
    actorUserId: input.actorUserId,
    actorRole: input.actorRole,
    intent: input.intent,
    risk: 'MEDIUM',
    rawInput: input.rawInput,
    payload: input.payload,
    summary: input.summary,
    status: 'PENDING',
    confirmationRequired: true,
    cardTitle: '请确认 AI 操作',
    confirmedByUserId: null,
    confirmedAt: null,
    cancelledAt: null,
    expiredAt: null,
    executedAt: null,
    expiresAt: input.expiresAt,
    createdAt: input.now,
    updatedAt: input.now,
  };
}

export function confirmRequest(request: ConfirmationRequest, input: ConfirmRequestInput): ConfirmationRequest {
  if (request.status !== 'PENDING') {
    throw new Error('只有待确认的 AI 操作可以确认');
  }

  if (input.confirmedAt > request.expiresAt) {
    throw new Error('确认卡片已过期，不能执行 AI 操作');
  }

  return {
    ...request,
    status: 'CONFIRMED',
    confirmedByUserId: input.confirmedByUserId,
    confirmedAt: input.confirmedAt,
    updatedAt: input.confirmedAt,
  };
}

export async function executeConfirmedRequest<T>(
  request: ConfirmationRequest,
  execute: (request: ConfirmationRequest) => Promise<T>,
): Promise<{ request: ExecutedConfirmationRequest; result: T }> {
  if (request.status !== 'CONFIRMED' || !request.confirmedAt) {
    throw new Error('确认前不能执行中风险 AI 动作');
  }

  const result = await execute(request);
  const executedRequest: ExecutedConfirmationRequest = {
    ...request,
    status: 'EXECUTED',
    executedAt: request.confirmedAt,
    updatedAt: request.confirmedAt,
  };

  return {
    request: executedRequest,
    result,
  };
}
