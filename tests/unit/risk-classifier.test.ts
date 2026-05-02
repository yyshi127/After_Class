import { describe, expect, it } from 'vitest';

import { classifyAiCommandRisk } from '@/domain/ai-command/risk-classifier';

describe('AI command risk classifier', () => {
  it('classifies read-only queries as low risk', () => {
    expect(classifyAiCommandRisk({ intent: 'queryAttendance', rawInput: '孩子到托了吗' })).toEqual({
      risk: 'LOW',
      confirmationRequired: false,
      rejected: false,
      reason: '低风险查询，可直接返回授权范围内结果',
    });

    expect(classifyAiCommandRisk({ intent: 'queryClassSettlement', rawInput: '看一下本校区班级毛利' })).toMatchObject({
      risk: 'LOW',
      confirmationRequired: false,
      rejected: false,
    });
  });

  it('classifies normal business writes as medium risk and requires confirmation', () => {
    expect(classifyAiCommandRisk({ intent: 'createLeaveRequest', rawInput: '明天请假一天' })).toEqual({
      risk: 'MEDIUM',
      confirmationRequired: true,
      rejected: false,
      reason: '中风险业务写入，必须生成确认卡片并经人工确认',
    });

    expect(classifyAiCommandRisk({ intent: 'recordHomeworkFeedback', rawInput: '给王小明生成作业点评' })).toMatchObject({
      risk: 'MEDIUM',
      confirmationRequired: true,
    });
  });

  it('rejects billing changes, student deletion and batch notification as high risk', () => {
    expect(classifyAiCommandRisk({ intent: 'queryBilling', rawInput: '把欠费改成 0' })).toEqual({
      risk: 'HIGH',
      confirmationRequired: false,
      rejected: true,
      reason: '高风险动作禁止由 AI 执行，请转到传统页面并由有权限人员人工复核',
    });

    expect(classifyAiCommandRisk({ intent: 'queryAttendance', rawInput: '删除学生王小明' })).toMatchObject({
      risk: 'HIGH',
      rejected: true,
    });

    expect(classifyAiCommandRisk({ intent: 'sendTeacherMessage', rawInput: '给全校家长批量通知涨价' })).toMatchObject({
      risk: 'HIGH',
      rejected: true,
    });
  });
});
