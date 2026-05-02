import type { AiIntent, RiskLevel } from '@/domain/shared/enums';

export type AiCommandRiskInput = {
  intent: AiIntent;
  rawInput: string;
};

export type AiCommandRiskClassification = {
  risk: RiskLevel;
  confirmationRequired: boolean;
  rejected: boolean;
  reason: string;
};

const LOW_RISK_QUERY_INTENTS: ReadonlySet<AiIntent> = new Set([
  'queryAttendance',
  'queryHomework',
  'queryBilling',
  'queryClassSettlement',
]);

const HIGH_RISK_PATTERNS = [
  /欠费.*(改成|清零|归零|变成|设为)\s*0/,
  /(修改|调整|改成|清零|归零).*(收费|欠费|余额|课费|金额|实收|应收)/,
  /(删除|移除|注销).*(学生|孩子|学员)/,
  /(全校|全部|所有|批量).*(通知|群发|发送|留言|短信|消息)/,
];

export function classifyAiCommandRisk(input: AiCommandRiskInput): AiCommandRiskClassification {
  if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(input.rawInput))) {
    return {
      risk: 'HIGH',
      confirmationRequired: false,
      rejected: true,
      reason: '高风险动作禁止由 AI 执行，请转到传统页面并由有权限人员人工复核',
    };
  }

  if (LOW_RISK_QUERY_INTENTS.has(input.intent)) {
    return {
      risk: 'LOW',
      confirmationRequired: false,
      rejected: false,
      reason: '低风险查询，可直接返回授权范围内结果',
    };
  }

  return {
    risk: 'MEDIUM',
    confirmationRequired: true,
    rejected: false,
    reason: '中风险业务写入，必须生成确认卡片并经人工确认',
  };
}
