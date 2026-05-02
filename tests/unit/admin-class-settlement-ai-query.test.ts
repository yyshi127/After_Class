import { describe, expect, it } from 'vitest';

import { queryAdminClassSettlementsForAi } from '@/domain/ai-command/admin-class-settlement-query';
import type { AdminClassSettlementRow } from '@/domain/admin/class-settlements';

const settlements: AdminClassSettlementRow[] = [
  {
    id: 'settlement-east-a-20260502',
    campusId: 'campus-east',
    campusName: '东城校区',
    classId: 'class-evening-a',
    className: '晚辅 A 班',
    serviceType: '晚辅导',
    teacherUserIds: ['teacher-chen'],
    teacherNames: ['陈老师'],
    settlementDate: new Date('2026-05-02T00:00:00.000Z'),
    expectedCount: 10,
    arrivedCount: 8,
    leaveCount: 1,
    absentCount: 0,
    pendingCount: 1,
    studentRevenueAmount: 1200,
    teacherFeeAmount: 360,
    reservedCostAmount: 120,
    estimatedGrossProfitAmount: 720,
  },
  {
    id: 'settlement-west-b-20260502',
    campusId: 'campus-west',
    campusName: '西城校区',
    classId: 'class-evening-b',
    className: '晚辅 B 班',
    serviceType: '晚全托',
    teacherUserIds: ['teacher-li'],
    teacherNames: ['李老师'],
    settlementDate: new Date('2026-05-02T00:00:00.000Z'),
    expectedCount: 8,
    arrivedCount: 7,
    leaveCount: 0,
    absentCount: 1,
    pendingCount: 0,
    studentRevenueAmount: 1600,
    teacherFeeAmount: 420,
    reservedCostAmount: 160,
    estimatedGrossProfitAmount: 1020,
  },
];

describe('admin AI class settlement query', () => {
  it('returns campus-scoped settlement revenue and gross-profit summaries for campus admins', () => {
    const result = queryAdminClassSettlementsForAi({
      actor: { id: 'campus-admin-east', role: 'CAMPUS_ADMIN', campusIds: ['campus-east'] },
      settlements,
      entities: { settlementDate: '2026-05-02' },
    });

    expect(result).toEqual({
      intent: 'queryClassSettlement',
      risk: 'LOW',
      results: [
        {
          settlementId: 'settlement-east-a-20260502',
          campusId: 'campus-east',
          campusName: '东城校区',
          classId: 'class-evening-a',
          className: '晚辅 A 班',
          serviceType: '晚辅导',
          settlementDate: '2026-05-02',
          teacherNames: '陈老师',
          attendanceSummary: '应到 10 / 到课 8 / 请假 1 / 缺勤 0 / 待确认 1',
          studentRevenueAmount: 1200,
          studentRevenueAmountLabel: '¥1200.00',
          teacherFeeAmount: 360,
          teacherFeeAmountLabel: '¥360.00',
          reservedCostAmount: 120,
          reservedCostAmountLabel: '¥120.00',
          estimatedGrossProfitAmount: 720,
          estimatedGrossProfitAmountLabel: '¥720.00',
        },
      ],
    });
    expect(JSON.stringify(result)).not.toContain('西城校区');
  });

  it('allows super admins to filter by campus, class and service type', () => {
    const result = queryAdminClassSettlementsForAi({
      actor: { id: 'super-admin', role: 'SUPER_ADMIN' },
      settlements,
      entities: { campusId: 'campus-west', classId: 'class-evening-b', serviceType: '晚全托' },
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      campusName: '西城校区',
      className: '晚辅 B 班',
      estimatedGrossProfitAmount: 1020,
    });
  });

  it('rejects teachers from querying class gross profit through AI', () => {
    expect(() =>
      queryAdminClassSettlementsForAi({
        actor: {
          id: 'teacher-chen',
          role: 'TEACHER',
          teacherAssignments: [{ campusId: 'campus-east', classId: 'class-evening-a' }],
        },
        settlements,
      }),
    ).toThrow('无权通过 AI 查询班级核算和毛利');
  });
});
