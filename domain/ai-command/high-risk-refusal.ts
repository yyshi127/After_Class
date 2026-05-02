import type { AiIntent, RiskLevel } from '@/domain/shared/enums';

import { classifyAiCommandRisk } from './risk-classifier';

type HighRiskTraditionalPage = {
  label: string;
  href: string;
};

export type HighRiskRefusalCard = {
  rawInput: string;
  intent: AiIntent;
  risk: RiskLevel;
  rejected: boolean;
  executableByAi: false;
  title: string;
  reason: string;
  traditionalPage: HighRiskTraditionalPage;
  safetyNote: string;
};

const DEFAULT_TRADITIONAL_PAGE: HighRiskTraditionalPage = {
  label: '前往系统设置页人工复核',
  href: '/admin/settings',
};

function getTraditionalPageForHighRisk(input: { intent: AiIntent; rawInput: string }): HighRiskTraditionalPage {
  if (input.intent === 'queryBilling' || /(收费|欠费|余额|课费|金额|实收|应收|毛利)/.test(input.rawInput)) {
    return {
      label: '前往收费记录页人工复核',
      href: '/admin/billing',
    };
  }

  if (/(删除|移除|注销).*(学生|孩子|学员)/.test(input.rawInput)) {
    return {
      label: '前往学生档案页人工复核',
      href: '/admin/students',
    };
  }

  return DEFAULT_TRADITIONAL_PAGE;
}

export function createHighRiskRefusalCard(input: { intent: AiIntent; rawInput: string }): HighRiskRefusalCard {
  const classification = classifyAiCommandRisk(input);

  if (!classification.rejected || classification.risk !== 'HIGH') {
    throw new Error('只有高风险 AI 指令才能生成拒绝卡片');
  }

  return {
    rawInput: input.rawInput,
    intent: input.intent,
    risk: classification.risk,
    rejected: true,
    executableByAi: false,
    title: 'AI 已拒绝执行高风险操作',
    reason: classification.reason,
    traditionalPage: getTraditionalPageForHighRisk(input),
    safetyNote: 'AI 不会修改收费、余额、欠费、老师课费或毛利数据。',
  };
}
