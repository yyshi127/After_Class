import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { buildApplicationLog, getLoggingPolicy, LOGGING_POLICIES } from '@/domain/operations/logging-policy';

const loggingStrategyDoc = readFileSync('docs/operations/logging-strategy.md', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');

describe('operations logging strategy', () => {
  it('defines application, AI, audit and error logging policies with retention and required fields', () => {
    expect(LOGGING_POLICIES.map((policy) => policy.category)).toEqual(['application', 'ai', 'audit', 'error']);
    expect(getLoggingPolicy('application')).toMatchObject({ storage: 'stdout', retentionDays: 30 });
    expect(getLoggingPolicy('ai')).toMatchObject({ storage: 'database', retentionDays: 365 });
    expect(getLoggingPolicy('audit')).toMatchObject({ storage: 'database', retentionDays: 1095 });
    expect(getLoggingPolicy('error')).toMatchObject({ storage: 'stdout', retentionDays: 90 });

    expect(getLoggingPolicy('ai').requiredFields).toEqual(
      expect.arrayContaining(['rawInput', 'confidence', 'risk', 'confirmationRequired', 'resultStatus']),
    );
    expect(getLoggingPolicy('audit').requiredFields).toEqual(
      expect.arrayContaining(['actorUserId', 'action', 'targetType', 'targetId', 'reason']),
    );
  });

  it('builds structured application/error logs without requiring sensitive payload fields', () => {
    expect(
      buildApplicationLog({
        timestamp: '2026-05-03T01:30:00.000Z',
        level: 'ERROR',
        category: 'error',
        requestId: 'req-1',
        route: '/teacher/photo-check-in',
        campusId: 'campus-1',
        message: 'Photo check-in upload failed',
        errorCode: 'FILE_UPLOAD_FAILED',
      }),
    ).toEqual({
      timestamp: '2026-05-03T01:30:00.000Z',
      level: 'ERROR',
      category: 'error',
      requestId: 'req-1',
      route: '/teacher/photo-check-in',
      campusId: 'campus-1',
      message: 'Photo check-in upload failed',
      errorCode: 'FILE_UPLOAD_FAILED',
      actorUserId: undefined,
    });
  });

  it('documents privacy-safe traceability and uses existing database log models', () => {
    expect(schema).toContain('model AiActionLog');
    expect(schema).toContain('model AuditLog');
    expect(loggingStrategyDoc).toContain('应用日志 application');
    expect(loggingStrategyDoc).toContain('AI 日志 ai');
    expect(loggingStrategyDoc).toContain('审计日志 audit');
    expect(loggingStrategyDoc).toContain('错误日志 error');
    expect(loggingStrategyDoc).toContain('不得打印身份证号、家长手机号、学生照片 URL');
    expect(loggingStrategyDoc).toContain('requestId');
  });
});
