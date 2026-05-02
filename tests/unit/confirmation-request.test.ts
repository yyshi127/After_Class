import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildConfirmationRequest,
  confirmRequest,
  executeConfirmedRequest,
} from '@/domain/ai-command/confirmation-request';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

describe('ConfirmationRequest model and service', () => {
  it('defines a ConfirmationRequest model for medium-risk AI actions', () => {
    expect(schema).toContain('enum ConfirmationRequestStatus');
    expect(schema).toContain('PENDING');
    expect(schema).toContain('CONFIRMED');
    expect(schema).toContain('CANCELLED');
    expect(schema).toContain('EXPIRED');
    expect(schema).toContain('EXECUTED');
    expect(schema).toContain('model ConfirmationRequest');
    expect(schema).toMatch(/actorUserId\s+String/);
    expect(schema).toMatch(/intent\s+AiIntent/);
    expect(schema).toMatch(/risk\s+AiRiskLevel/);
    expect(schema).toMatch(/status\s+ConfirmationRequestStatus/);
    expect(schema).toMatch(/payload\s+Json/);
    expect(schema).toMatch(/expiresAt\s+DateTime/);
    expect(schema).toContain('@@index([actorUserId])');
    expect(schema).toContain('@@index([status])');
  });

  it('builds a pending confirmation card and refuses to execute before human confirmation', async () => {
    const request = buildConfirmationRequest({
      id: 'confirm-leave-001',
      actorUserId: 'guardian-001',
      actorRole: 'GUARDIAN',
      intent: 'createLeaveRequest',
      rawInput: '帮王小明明天请假，原因是发烧',
      payload: {
        studentId: 'student-xiaoming',
        leaveDate: '2026-05-03',
        reason: '发烧',
      },
      summary: '为王小明创建 2026-05-03 请假申请，原因：发烧',
      now: new Date('2026-05-02T09:00:00.000Z'),
      expiresAt: new Date('2026-05-02T09:10:00.000Z'),
    });
    const writes: string[] = [];

    await expect(
      executeConfirmedRequest(request, async () => {
        writes.push('created-leave-request');
        return { leaveRequestId: 'leave-001' };
      }),
    ).rejects.toThrow('确认前不能执行中风险 AI 动作');

    expect(request.status).toBe('PENDING');
    expect(request.confirmationRequired).toBe(true);
    expect(request.cardTitle).toBe('请确认 AI 操作');
    expect(writes).toEqual([]);
  });

  it('executes the domain write only after confirmation and marks the request executed', async () => {
    const pending = buildConfirmationRequest({
      id: 'confirm-message-001',
      actorUserId: 'guardian-001',
      actorRole: 'GUARDIAN',
      intent: 'sendTeacherMessage',
      rawInput: '告诉老师今晚作业要晚点交',
      payload: {
        studentId: 'student-xiaoming',
        message: '今晚作业要晚点交',
      },
      summary: '向负责老师留言：今晚作业要晚点交',
      now: new Date('2026-05-02T09:00:00.000Z'),
      expiresAt: new Date('2026-05-02T09:10:00.000Z'),
    });
    const confirmed = confirmRequest(pending, {
      confirmedByUserId: 'guardian-001',
      confirmedAt: new Date('2026-05-02T09:02:00.000Z'),
    });
    const writes: string[] = [];

    const result = await executeConfirmedRequest(confirmed, async (request) => {
      writes.push(`message:${request.payload.message}`);
      return { messageId: 'message-001' };
    });

    expect(result).toEqual({
      request: expect.objectContaining({
        status: 'EXECUTED',
        executedAt: new Date('2026-05-02T09:02:00.000Z'),
      }),
      result: { messageId: 'message-001' },
    });
    expect(writes).toEqual(['message:今晚作业要晚点交']);
  });
});
