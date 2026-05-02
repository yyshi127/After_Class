import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildAiActionLogPayload, withAiActionLogging } from '@/domain/ai-command/ai-action-log';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

describe('AI action log foundation', () => {
  it('defines AiActionLog model with actor, raw input, intent, entities, confidence, risk, confirmation and result fields', () => {
    expect(schema).toContain('enum AiRiskLevel');
    expect(schema).toContain('enum AiActionResultStatus');
    expect(schema).toContain('model AiActionLog');
    expect(schema).toMatch(/actorUserId\s+String/);
    expect(schema).toMatch(/actorRole\s+Role/);
    expect(schema).toMatch(/rawInput\s+String/);
    expect(schema).toMatch(/intent\s+AiIntent\?/);
    expect(schema).toMatch(/entities\s+Json\?/);
    expect(schema).toMatch(/confidence\s+Float/);
    expect(schema).toMatch(/risk\s+AiRiskLevel/);
    expect(schema).toMatch(/confirmationRequired\s+Boolean/);
    expect(schema).toMatch(/confirmedAt\s+DateTime\?/);
    expect(schema).toMatch(/resultStatus\s+AiActionResultStatus/);
    expect(schema).toMatch(/failureReason\s+String\?/);
  });

  it('builds a complete AI action log payload for a successful low-risk query', () => {
    expect(
      buildAiActionLogPayload({
        actorUserId: 'guardian-1',
        actorRole: 'GUARDIAN',
        rawInput: '今天孩子到托了吗？',
        intent: 'queryAttendance',
        entities: { studentId: 'student-1' },
        confidence: 0.92,
        risk: 'LOW',
        confirmationRequired: false,
        resultStatus: 'EXECUTED',
        resultSummary: '返回绑定孩子到托状态',
      }),
    ).toEqual({
      actorUserId: 'guardian-1',
      actorRole: 'GUARDIAN',
      rawInput: '今天孩子到托了吗？',
      intent: 'queryAttendance',
      entities: { studentId: 'student-1' },
      confidence: 0.92,
      risk: 'LOW',
      confirmationRequired: false,
      confirmedAt: null,
      resultStatus: 'EXECUTED',
      resultSummary: '返回绑定孩子到托状态',
      failureReason: null,
    });
  });

  it('records an AI action log for every AI call even when the call fails', async () => {
    const persistedLogs: ReturnType<typeof buildAiActionLogPayload>[] = [];

    await expect(
      withAiActionLogging({
        base: {
          actorUserId: 'teacher-1',
          actorRole: 'TEACHER',
          rawInput: '帮我生成三类点评',
          intent: 'recordHomeworkFeedback',
          entities: { studentId: 'student-1' },
          confidence: 0.87,
          risk: 'MEDIUM',
          confirmationRequired: true,
        },
        execute: async () => {
          throw new Error('provider timeout');
        },
        persist: async (payload) => {
          persistedLogs.push(payload);
        },
      }),
    ).rejects.toThrow('provider timeout');

    expect(persistedLogs).toHaveLength(1);
    expect(persistedLogs[0]).toMatchObject({
      actorUserId: 'teacher-1',
      actorRole: 'TEACHER',
      rawInput: '帮我生成三类点评',
      intent: 'recordHomeworkFeedback',
      risk: 'MEDIUM',
      confirmationRequired: true,
      resultStatus: 'FAILED',
      failureReason: 'provider timeout',
    });
  });
});
