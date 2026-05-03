# AfterClass 日志策略

M9-07 的目标是让生产部署后关键操作可追踪，同时避免把未成年人隐私和内部财务数据扩散到普通应用日志。

## 日志分层

| 类别 | 存储 | 保留期 | 作用 |
| --- | --- | --- | --- |
| 应用日志 application | stdout / 平台日志 | 30 天 | 请求、页面、后台任务、健康检查排障 |
| AI 日志 ai | 数据库 `AiActionLog` | 365 天 | AI 输入、意图、置信度、风险、确认状态、执行结果 |
| 审计日志 audit | 数据库 `AuditLog` | 1095 天 | 身份证查看、数据导出、收费修改等敏感操作留痕 |
| 错误日志 error | stdout / 平台日志 | 90 天 | 未捕获异常、AI Provider 超时、数据库错误 |

## 必填字段

- 应用日志：`timestamp`、`level`、`requestId`、`route`、`message`。
- AI 日志：`actorUserId`、`actorRole`、`rawInput`、`intent`、`confidence`、`risk`、`confirmationRequired`、`resultStatus`。
- 审计日志：`actorUserId`、`action`、`targetType`、`targetId`、`reason`、`metadata`。
- 错误日志：`timestamp`、`level`、`requestId`、`message`、`errorCode`。

## 隐私与安全规则

- stdout 应用/错误日志不得打印身份证号、家长手机号、学生照片 URL、作业原图私有路径、真实 API key、数据库连接串、余额、欠费、教师费用、毛利。
- AI 日志可以保存原始输入，但必须按权限只向管理员展示，并保留风险等级和人工确认状态。
- 审计日志用于回答“谁在何时因为什么查看/导出/修改了敏感数据”。敏感查看、导出、收费调整必须先构造审计记录再执行业务动作。
- 错误日志面向排障，只记录错误码、请求 ID、路由和安全摘要；详细堆栈仅进入受控平台日志，不回显给家长/学生端。

## 关键操作追踪清单

- 学生到托/离校签到：应用日志记录 requestId、actorUserId、campusId；异常状态进入错误日志。
- AI 作业批改/家长 AI 查询/高风险拒绝：进入 `AiActionLog`，包括风险、确认、失败原因。
- 身份证完整查看、敏感数据导出、收费调整：进入 `AuditLog`，并要求 reason。
- 备份、迁移、seed：应用日志记录开始/结束/失败，但不得打印连接串或密码。

## 运营检查

- 每周抽查 AI 日志中的高风险/失败记录。
- 每月抽查审计日志中敏感查看和导出记录。
- 每次线上事故复盘必须能用 requestId 关联应用日志与错误日志。
