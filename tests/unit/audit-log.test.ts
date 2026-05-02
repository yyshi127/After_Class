import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildIdentityNumberViewAuditLog } from '@/domain/audit/audit-log';

const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');

describe('audit log foundation', () => {
  it('defines AuditLog for sensitive view/export/billing operations', () => {
    expect(schema).toContain('enum AuditAction');
    expect(schema).toContain('VIEW_SENSITIVE_IDENTITY');
    expect(schema).toContain('EXPORT_SENSITIVE_DATA');
    expect(schema).toContain('UPDATE_BILLING');
    expect(schema).toContain('model AuditLog');
    expect(schema).toContain('actorUserId String');
    expect(schema).toContain('action      AuditAction');
    expect(schema).toContain('targetType  String');
    expect(schema).toContain('targetId    String');
    expect(schema).toContain('reason      String?');
    expect(schema).toContain('metadata    Json?');
  });

  it('builds an audit log payload before full identity number viewing is allowed', () => {
    expect(
      buildIdentityNumberViewAuditLog({
        actorUserId: 'admin-1',
        studentId: 'student-1',
        reason: '线下核验家长证件',
      }),
    ).toEqual({
      actorUserId: 'admin-1',
      action: 'VIEW_SENSITIVE_IDENTITY',
      targetType: 'Student',
      targetId: 'student-1',
      reason: '线下核验家长证件',
      metadata: { field: 'identityNumber' },
    });
  });
});
