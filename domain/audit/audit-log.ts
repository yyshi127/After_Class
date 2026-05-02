export type AuditAction = 'VIEW_SENSITIVE_IDENTITY' | 'EXPORT_SENSITIVE_DATA' | 'UPDATE_BILLING';

export type AuditLogPayload = {
  actorUserId: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  reason?: string;
  metadata?: Record<string, string>;
};

export function buildIdentityNumberViewAuditLog(input: {
  actorUserId: string;
  studentId: string;
  reason?: string;
}): AuditLogPayload {
  return {
    actorUserId: input.actorUserId,
    action: 'VIEW_SENSITIVE_IDENTITY',
    targetType: 'Student',
    targetId: input.studentId,
    reason: input.reason,
    metadata: { field: 'identityNumber' },
  };
}
