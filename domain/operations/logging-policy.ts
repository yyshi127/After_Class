export type OperationalLogCategory = 'application' | 'ai' | 'audit' | 'error';

export type LogRetentionPolicy = {
  category: OperationalLogCategory;
  storage: 'stdout' | 'database';
  retentionDays: number;
  requiredFields: readonly string[];
  examples: readonly string[];
};

export type StructuredApplicationLog = {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  category: OperationalLogCategory;
  message: string;
  requestId: string;
  actorUserId?: string;
  campusId?: string;
  route?: string;
  errorCode?: string;
};

export const LOGGING_POLICIES: readonly LogRetentionPolicy[] = [
  {
    category: 'application',
    storage: 'stdout',
    retentionDays: 30,
    requiredFields: ['timestamp', 'level', 'requestId', 'route', 'message'],
    examples: ['page-load', 'api-request', 'background-job'],
  },
  {
    category: 'ai',
    storage: 'database',
    retentionDays: 365,
    requiredFields: [
      'actorUserId',
      'actorRole',
      'rawInput',
      'intent',
      'confidence',
      'risk',
      'confirmationRequired',
      'resultStatus',
    ],
    examples: ['homework-correction-draft', 'guardian-ai-query', 'high-risk-refusal'],
  },
  {
    category: 'audit',
    storage: 'database',
    retentionDays: 1095,
    requiredFields: ['actorUserId', 'action', 'targetType', 'targetId', 'reason', 'metadata'],
    examples: ['sensitive-identity-view', 'billing-update', 'data-export'],
  },
  {
    category: 'error',
    storage: 'stdout',
    retentionDays: 90,
    requiredFields: ['timestamp', 'level', 'requestId', 'message', 'errorCode'],
    examples: ['unhandled-exception', 'provider-timeout', 'database-error'],
  },
];

export function getLoggingPolicy(category: OperationalLogCategory): LogRetentionPolicy {
  const policy = LOGGING_POLICIES.find((item) => item.category === category);

  if (!policy) {
    throw new Error(`Missing logging policy for category: ${category}`);
  }

  return policy;
}

export function buildApplicationLog(input: Omit<StructuredApplicationLog, 'timestamp'> & { timestamp?: string }): StructuredApplicationLog {
  return {
    timestamp: input.timestamp ?? new Date().toISOString(),
    level: input.level,
    category: input.category,
    message: input.message,
    requestId: input.requestId,
    actorUserId: input.actorUserId,
    campusId: input.campusId,
    route: input.route,
    errorCode: input.errorCode,
  };
}
