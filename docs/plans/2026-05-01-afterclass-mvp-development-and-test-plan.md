# 智能晚辅托管系统 MVP 开发与测试计划

> **For Hermes:** 后续开发必须按本文任务清单逐项推进；每完成一项，将对应复选框从 `[ ]` 改为 `[x]`，并在任务下补充验证结果、测试命令和提交记录。

**生成时间：** 2026-05-01 23:46:26 CST  
**项目目录：** `/home/ubuntu/project/afterclass`  
**需求基准：** `需求分析/智能晚辅托管系统MVP版本需求分析说明书.md`  
**UI 设计稿：** `ui-design/afterclass-mvp-ui.html`  
**目标：** 交付一套可真实运营的商用级智能晚辅托管 MVP 系统，跑通“校区建档 → 学生/家长/班级/托管类型 → 学生/老师考勤 → 拍照签到通知 → 作业批改与三类反馈 → 错题本与 Word 练习单 → 收费与班级核算 → AI 操作审计”的完整闭环。

---

## 0. 计划执行规则

### 0.1 打钩规则

后续开发过程中，每个任务必须满足以下条件才允许打钩：

1. 代码或配置已完成。
2. 对应测试已新增或已更新。
3. 至少运行过该任务指定的验证命令。
4. 验证结果已记录在任务下方。
5. 没有遗留明显 TypeScript、lint、测试或构建错误。

任务状态统一使用：

```markdown
- [ ] 未开始
- [x] 已完成
- [-] 暂缓 / 取消，必须写明原因
```

### 0.2 开发纪律

- 严格遵循项目 `AGENTS.md`：谨慎、简单、外科手术式修改、每项变更可追溯到需求。
- 所有业务写入必须走 domain service，不允许页面组件直接绕过权限和审计写库。
- 所有 AI 写入、生成、圈错、发布类动作默认是草稿或确认后执行。
- 高风险 AI 动作必须拒绝或引导传统页面，不允许直接执行。
- 家长端不得展示余额、欠费金额、机构收入、老师课费、班级毛利等经营数据。
- 身份证号默认脱敏；完整查看或导出必须记录日志。
- 图片资源必须按授权访问，不允许公开 URL 裸奔。

### 0.3 每个开发任务的标准流程

```text
1. 明确当前任务边界
2. 写测试或可执行检查
3. 运行测试，确认失败或基线状态
4. 编写最小实现
5. 运行任务级测试
6. 运行相关回归测试
7. 更新本文任务复选框
8. 记录验证结果
```

---

## 1. 技术栈详细说明

### 1.1 总体架构选择

本 MVP 建议采用 **Next.js 全栈单体架构**。

原因：

- MVP 目标是快速形成可商用业务闭环，不适合一开始拆微服务。
- 管理端、老师端、家长端、学生端都可以用同一个 Next.js 项目承载。
- Server Actions / Route Handlers 可承载中轻量业务 API。
- Prisma + PostgreSQL 能清晰支撑多校区、权限、收费、审计等关系数据。
- Tailwind + shadcn/ui 适合快速落地设计稿，同时保持组件一致性。

推荐目录结构：

```text
afterclass/
  app/
    (auth)/
    admin/
    teacher/
    parent/
    student/
    api/
  components/
    ui/
    layout/
    business/
  domain/
    auth/
    campus/
    users/
    classes/
    attendance/
    homework/
    feedback/
    mistake-book/
    billing/
    settlement/
    ai-command/
    files/
    notices/
  lib/
    db.ts
    auth.ts
    permissions.ts
    audit.ts
    validators.ts
  prisma/
    schema.prisma
    seed.ts
  tests/
    unit/
    integration/
    e2e/
  docs/
    plans/
```

### 1.2 前端技术栈

| 项目 | 选择 | 说明 |
|---|---|---|
| 框架 | Next.js App Router | 同时支持管理端 Web 和移动 H5 页面 |
| 语言 | TypeScript | 保证业务模型和权限规则可维护 |
| 样式 | Tailwind CSS | 快速实现 UI 设计稿 token |
| 组件 | shadcn/ui + Radix UI | 表单、弹窗、Sheet、Tabs、Table、Toast 等 |
| 图标 | lucide-react | 统一线性图标，不使用 emoji 做结构图标 |
| 表单 | react-hook-form + zod | 表单状态和校验统一 |
| 数据请求 | Server Actions / Route Handlers + fetch | MVP 不引入复杂状态库 |
| 图表 | Recharts | 首页看板、核算趋势、班级数据 |
| 移动端适配 | 响应式 H5 | 家长端和学生端优先 390px 宽度体验 |
| 富交互 | Canvas/SVG 标注 | 作业圈错区域 MVP 可先用坐标框标注 |

### 1.3 后端技术栈

| 项目 | 选择 | 说明 |
|---|---|---|
| 运行时 | Node.js LTS | 与 Next.js 同栈 |
| API 层 | Next.js Route Handlers / Server Actions | MVP 简化部署和认证上下文 |
| ORM | Prisma | 关系模型清晰，迁移可追踪 |
| 数据库 | PostgreSQL | 商用 SaaS 基础数据库 |
| 文件存储 | 本地私有文件目录起步，抽象 StorageService | 后续可切换 S3/COS/MinIO |
| 鉴权 | NextAuth/Auth.js 或自研轻量 session | 根据初始化时依赖选择；必须支持 RBAC |
| 权限 | RBAC + campus scope + ownership scope | 管理员、校区管理员、老师、家长、学生 |
| 审计 | AuditLog / AiActionLog 表 | AI、敏感数据查看、收费修改都记录 |
| 导出 | docx 库 | 生成 Word 练习单 |
| 通知 | 站内通知表起步 | 短信/公众号/飞书等外部推送后置 |

### 1.4 AI 能力技术栈

| 项目 | 选择 | 说明 |
|---|---|---|
| Provider | 可插拔 AiProvider 接口 | 不绑定单一模型 |
| 意图识别 | 规则优先 + LLM JSON 输出 | MVP 保持可控 |
| 结构化输出 | zod schema 校验 | 防止 AI 输出污染业务数据 |
| 风险控制 | RiskClassifier | 低/中/高风险明确分流 |
| 确认卡片 | ConfirmationRequest 模型 | 中风险写入必须确认 |
| 审计 | AiActionLog | 原始输入、意图、实体、置信度、结果 |
| 图片 AI | 作业圈错建议草稿 | MVP 不承诺精准 OCR 和自动判分 |

AI 写入链路固定为：

```text
用户输入
→ intent/entity extraction
→ permission check
→ risk classification
→ confirmation card, if medium risk
→ domain service execution
→ audit log
```

禁止链路：

```text
AI 输出 SQL / AI 直接写数据库 / AI 绕过 service / AI 修改金额 / AI 删除学生
```

### 1.5 数据库与数据安全

核心数据库：PostgreSQL。

关键策略：

- 所有运营数据必须带 `campusId`。
- 用户权限不只看 role，还要看 campus scope 和对象绑定关系。
- 家长访问必须通过 guardian-student binding 校验。
- 老师访问必须通过 teacher-campus/class assignment 校验。
- 身份证号存储可先明文 + 脱敏展示；商用上线前应升级为字段级加密或 KMS 加密。
- 图片文件不放 public 目录，必须通过授权 API 读取。

### 1.6 测试技术栈

| 测试类型 | 工具 | 覆盖重点 |
|---|---|---|
| 单元测试 | Vitest | 纯业务规则、权限、AI 风险、脱敏、核算 |
| 组件测试 | React Testing Library | 表单、确认卡片、家长端敏感信息隐藏 |
| 集成测试 | Vitest + 测试数据库 | Prisma service、权限查询、业务写入 |
| E2E 测试 | Playwright | 管理端/老师端/家长端/学生端主流程 |
| 类型检查 | TypeScript | 模型、DTO、组件 props |
| 静态检查 | ESLint | 基础质量门禁 |
| 构建检查 | next build | 生产构建可用 |

标准验证命令建议：

```bash
npm run lint
npm run typecheck
npm run test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run build
```

如使用 pnpm，则对应为：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm build
```

### 1.7 部署技术栈

MVP 起步：Docker Compose。

建议服务：

```text
web: Next.js app
postgres: PostgreSQL
redis: 可选，后续用于队列/缓存
storage: 本地 volume，后续迁移对象存储
```

上线前最低要求：

- `.env.example` 完整。
- 数据库 migration 可重复执行。
- 种子数据可初始化 demo 环境。
- 文件目录持久化。
- 每日数据库备份脚本。
- 错误日志和访问日志可查看。

---

## 2. 里程碑总览

| 里程碑 | 目标 | 完成标准 |
|---|---|---|
| M0 | 项目初始化与质量门禁 | Next.js、Prisma、测试、CI 本地命令可运行 |
| M1 | 数据模型与权限基础 | 多校区、角色、学生、家长、老师、班级、托管类型可建档 |
| M2 | 管理端基础资料 | 校区、学生、班级、老师、家长管理页面可用 |
| M3 | 考勤与到托照片 | 老师端签到、学生拍照签到、家长通知链路可用 |
| M4 | 作业批改与三类反馈 | 上传作业、AI 圈错草稿、老师确认、家长查看反馈 |
| M5 | 错题本与 Word 练习单 | 错题收录、同类题草稿、老师勾选、生成 Word |
| M6 | 收费与班级核算 | 服务有效期、收费记录、老师课费、班级毛利、家长隐藏金额 |
| M7 | AI Command Layer | 9 个 MVP 意图、风险分级、确认卡片、审计日志 |
| M8 | UI 完整落地与 E2E | 四端核心页面按设计稿实现并通过主流程测试 |
| M9 | 部署与验收 | Docker Compose 可启动，验收清单全通过 |

---

## 3. 详细开发任务清单

### M0. 项目初始化与工程质量门禁

- [x] M0-01 确认包管理器与初始化方式  
  **目标：** 如果项目尚未初始化，选择 Next.js + TypeScript + Tailwind。  
  **验证：** `package.json` 存在，能运行依赖安装命令。  
  **完成记录：** 2026-05-02 使用 npm 作为包管理器，已生成 `package.json` 与 `package-lock.json`。  
  **测试命令：** `npm install`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-02 初始化 Next.js App Router 项目  
  **目标：** 创建 `app/`、`components/`、`lib/` 基础结构。  
  **验证：** `npm run dev` 或 `pnpm dev` 能启动首页。  
  **完成记录：** 已创建 `app/layout.tsx`、`app/page.tsx`、`components/ui/*`、`lib/utils.ts` 基础结构。  
  **测试命令：** `npm run build`、`npm run test:e2e`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-03 配置 Tailwind CSS  
  **目标：** 接入 mental-health demo 风格 token：雾蓝、薰衣草、蜜桃、薄荷、拟物阴影。  
  **验证：** 首页能显示基础样式，无 Tailwind 编译错误。  
  **完成记录：** 已配置 `tailwind.config.js` 与 `app/globals.css`，保留 calming pastel / neumorphic token。  
  **测试命令：** `npm run build`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-04 接入 shadcn/ui 基础组件  
  **目标：** 安装 Button、Card、Input、Dialog、Sheet、Tabs、Table、Toast。  
  **验证：** 示例组件可渲染。  
  **完成记录：** 已执行 `shadcn init`，安装 Button、Card、Input、Dialog、Sheet、Tabs、Table；Toast 使用当前 shadcn 推荐的 `Sonner` 组件替代。  
  **测试命令：** `npm run typecheck`、`npm run lint`、`npm run build`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-05 配置 ESLint 与 TypeScript 严格检查  
  **目标：** 设置 lint/typecheck 命令。  
  **验证：** `npm run lint`、`npm run typecheck` 通过。  
  **完成记录：** 已创建 `eslint.config.mjs`、`tsconfig.json` 并设置 npm scripts。  
  **测试命令：** `npm run lint`、`npm run typecheck`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-06 配置 Vitest  
  **目标：** 支持单元测试和 service 测试。  
  **验证：** 一个示例测试 RED/GREEN 通过。  
  **完成记录：** 已创建 `vitest.config.ts`、`tests/setup.ts`、`tests/unit/dependencies.test.ts` 依赖 smoke test。  
  **测试命令：** `npm run test:unit`，结果 1 个文件 2 个测试通过。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-07 配置 Playwright  
  **目标：** 支持 E2E 测试。  
  **验证：** 首页 smoke test 通过。  
  **完成记录：** 已安装 `@playwright/test` 与 Chromium，创建 `playwright.config.ts` 和 `tests/e2e/home.spec.ts`。  
  **测试命令：** `npm run test:e2e`，结果 1 个测试通过。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-08 配置 Prisma 与 PostgreSQL 连接  
  **目标：** `prisma/schema.prisma`、`.env.example`、数据库连接可用。  
  **验证：** `npx prisma validate` 通过。  
  **完成记录：** 已安装 PostgreSQL 16，创建本地开发库 `afterclass_dev` 和用户 `afterclass`；已配置 `.env`、`.env.example`、`prisma.config.ts`、`prisma/schema.prisma`。  
  **测试命令：** `pg_isready`、`PGPASSWORD=afterclass_dev_password psql -h localhost -U afterclass -d afterclass_dev -tAc 'select current_database() || $$ as $$ || current_user;'`、`npm run prisma:validate`、`npm run prisma:generate`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-09 创建基础 layout 与四端路由壳  
  **目标：** `/admin`、`/teacher`、`/parent`、`/student` 路由存在。  
  **验证：** Playwright 能访问四个路由。  
  **完成记录：** 已新增 `components/role-shell.tsx`，以及 `/admin`、`/teacher`、`/parent`、`/student` 四端路由页面；新增 `tests/e2e/role-shells.spec.ts` 覆盖四端入口。  
  **TDD 记录：** 先运行 `npm run test:e2e -- tests/e2e/role-shells.spec.ts`，4 个用例按预期失败；实现路由后同一命令通过。  
  **测试命令：** `npm run test:e2e -- tests/e2e/role-shells.spec.ts`、`npm run test:e2e`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M0-10 建立任务打钩维护机制  
  **目标：** 本计划作为进度源，每完成任务更新复选框。  
  **验证：** 修改本文并记录首次完成项。  
  **完成记录：** 已在本节按完成项更新 checkbox，并补充验证命令与提交状态。  
  **测试命令：** `read_file docs/plans/2026-05-01-afterclass-mvp-development-and-test-plan.md` 抽查 M0 段落。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

---

### M1. 数据模型与权限基础

- [x] M1-01 定义固定枚举  
  **内容：** Role、ServiceType、StudentStatus、AttendanceStatus、TeacherAttendanceStatus、BillingCycle、RiskLevel、AiIntent。  
  **测试：** 枚举值包含需求规定值，不能出现自定义托管类型。  
  **完成记录：** 已新增 `domain/shared/enums.ts`，定义角色、四种固定托管类型、学生状态、学生考勤状态、老师考勤状态、计费周期、AI 风险级别和 9 个 MVP AI 意图。  
  **TDD 记录：** 先新增 `tests/unit/domain-enums.test.ts` 并运行失败；实现枚举并补充 Vitest `@/*` alias 后测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/domain-enums.test.ts`、`npm run test:unit`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-02 创建 User / Account / Session 基础模型  
  **内容：** 支持管理员、校区管理员、老师、家长、学生角色。  
  **测试：** 不同 role 能被正确识别。  
  **完成记录：** 已在 `prisma/schema.prisma` 新增 `Role` enum、`User`、`Account`、`Session` 基础认证模型；新增 `domain/users/roles.ts` 提供 role 识别、管理端角色识别和四端入口归属判断。  
  **TDD 记录：** 先新增 `tests/unit/user-auth-models.test.ts` 并运行失败，失败原因为 `@/domain/users/roles` 尚不存在；实现模型与角色工具后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/user-auth-models.test.ts`、`npm run prisma:validate`、`npm run typecheck`、`npm run lint`、`npm run test:unit`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-03 创建 Campus 模型  
  **内容：** 校区名称、地址、电话、负责人、状态、服务时段、支持托管类型。  
  **测试：** 停用校区不能新建学生/班级。  
  **完成记录：** 已在 `prisma/schema.prisma` 新增 `CampusStatus` enum 和 `Campus` 模型，包含名称、地址、电话、负责人、状态、服务时段和支持托管类型。已新增 `domain/campus/campus.ts` 校区启停与服务类型判断。  
  **TDD 记录：** `tests/unit/campus-class-student-models.test.ts` 覆盖 Campus 字段、停用校区禁止建学生/班级、校区支持托管类型判断。  
  **测试命令：** `npm run test:unit`、`npm run prisma:validate`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-04 创建 Class 模型  
  **内容：** 校区、年级、班级名、容量、老师分配。  
  **测试：** 班级必须属于一个校区。  
  **完成记录：** 已在 `prisma/schema.prisma` 新增 `CustodyClass` 模型，包含校区、年级、班级名、容量和校区内班级名唯一约束。已新增 `domain/classes/classes.ts` 校区归属断言。  
  **TDD 记录：** `tests/unit/campus-class-student-models.test.ts` 覆盖班级模型字段和班级必须属于指定校区的校验。  
  **测试命令：** `npm run test:unit`、`npm run prisma:validate`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-05 创建 Student 模型  
  **内容：** 学生档案、身份证号、学校、年级、校区、班级、托管类型、状态、安全备注。  
  **测试：** 学生必须选择四种托管类型之一。  
  **完成记录：** 已在 `prisma/schema.prisma` 新增 `StudentStatus` enum 和 `Student` 模型，包含学生档案、身份证号、学校、年级、校区、班级、固定托管类型、状态与安全备注。已新增 `domain/students/students.ts` 托管类型校验。  
  **TDD 记录：** `tests/unit/campus-class-student-models.test.ts` 覆盖 Student 字段和拒绝非固定托管类型。  
  **测试命令：** `npm run test:unit`、`npm run prisma:validate`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-06 创建 Guardian 与学生绑定模型  
  **内容：** 家长账号、手机号、与学生关系、通知设置。  
  **测试：** 家长只能访问绑定学生。  
  **完成记录：** 已在 `prisma/schema.prisma` 新增 `GuardianStudent` 绑定模型，包含家长用户、学生、关系、手机号、通知开关和唯一绑定约束。权限测试覆盖家长只能访问绑定学生。  
  **TDD 记录：** 先由 `tests/unit/permissions-and-bindings.test.ts` 验证模型和权限缺失失败；实现模型与权限服务后通过。  
  **测试命令：** `npm run test:unit`、`npm run prisma:validate`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-07 创建 TeacherAssignment 模型  
  **内容：** 老师可分配到多个校区和班级。  
  **测试：** 老师只能访问被分配校区/班级。  
  **完成记录：** 已在 `prisma/schema.prisma` 新增 `TeacherAssignment` 模型，支持老师分配到校区或具体班级，并建立唯一约束和索引。权限测试覆盖老师校区/班级访问边界。  
  **TDD 记录：** 先由 `tests/unit/permissions-and-bindings.test.ts` 验证模型和权限缺失失败；实现模型与权限服务后通过。  
  **测试命令：** `npm run test:unit`、`npm run prisma:validate`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-08 创建权限服务 `domain/auth/permissions.ts`  
  **内容：** `canAccessCampus`、`canAccessStudent`、`canAccessClass`、`canViewFinancials`。  
  **测试：** 覆盖超级管理员、校区管理员、老师、家长、学生。  
  **完成记录：** 已新增 `domain/auth/permissions.ts`，覆盖超级管理员/管理员全局访问、校区管理员校区范围、老师/助教分配范围、家长绑定学生、学生本人记录，以及家长/学生/老师不能查看财务数据。  
  **TDD 记录：** 先由 `tests/unit/permissions-and-bindings.test.ts` 运行失败，失败原因为权限服务不存在；实现后测试通过。  
  **测试命令：** `npm run test:unit`、`npm run typecheck`、`npm run lint`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-09 创建身份证号脱敏工具  
  **内容：** 默认 `3101********3218` 格式。  
  **测试：** 列表和家长端使用脱敏值。  
  **完成记录：** 已新增 `domain/students/identity.ts`，提供 `maskIdentityNumber`、`toStudentListItem`、`toStudentParentProfile`，默认保留前 4 后 4，中间脱敏。  
  **TDD 记录：** 先由 `tests/unit/student-identity-masking.test.ts` 运行失败，失败原因为脱敏模块不存在；实现后测试通过。  
  **测试命令：** `npm run test:unit`、`npm run typecheck`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-10 创建 AuditLog 模型  
  **内容：** 敏感数据查看、导出、收费修改等审计。  
  **测试：** 查看完整身份证号必须生成审计记录。  
  **完成记录：** 已在 `prisma/schema.prisma` 新增 `AuditAction` enum 和 `AuditLog` 模型；已新增 `domain/audit/audit-log.ts` 构造查看完整身份证号前的审计日志 payload。  
  **TDD 记录：** 先由 `tests/unit/audit-log.test.ts` 运行失败，失败原因为审计模块和模型不存在；实现后测试通过。  
  **测试命令：** `npm run test:unit`、`npm run prisma:validate`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M1-11 编写 Prisma seed 基础数据  
  **内容：** 2 个校区、4 种托管类型、多个角色、班级、学生、家长绑定。  
  **测试：** seed 后 demo 登录数据可用于四端页面。  
  **完成记录：** 已新增 `prisma/seed-data.ts`，包含 2 个校区、4 种固定托管类型、超级管理员/校区管理员/老师/家长/学生账号、班级、学生、家长绑定和老师分配；已新增 `prisma/seed.ts` 作为后续真实迁移后的 seed 入口。  
  **TDD 记录：** 先新增 `tests/unit/demo-seed-data.test.ts` 并运行失败，失败原因为 seed 数据模块不存在；实现后测试通过。  
  **测试命令：** `npm run test:unit`、`npm run typecheck`、`npm run lint`、`npm run prisma:validate`、`npm run build`、`npm run test:e2e`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

---

### M2. 管理端基础资料页面

- [x] M2-01 管理端整体布局  
  **内容：** 侧边栏、顶部校区筛选、用户菜单。  
  **测试：** 校区管理员只看到授权校区。  
  **完成记录：** 2026-05-02 新增 `AdminLayout` 管理端整体布局，包含侧边栏、顶部校区筛选和用户菜单；校区筛选通过 `getVisibleCampusesForAdmin` 复用权限服务进行校区授权过滤，`/admin` 已接入该布局。  
  **TDD 记录：** 先新增 `tests/unit/admin-layout.test.tsx` 并运行失败，失败原因为布局组件和管理端布局 domain helper 不存在；实现 `components/admin/admin-layout.tsx` 与 `domain/admin/admin-layout.ts` 后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-layout.test.tsx`、`npm run typecheck`、`npm run lint`、`npm run test:unit`、`npm run prisma:validate`、`npm run build`、`npm run test:e2e`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-02 首页看板静态结构  
  **内容：** 今日到托、出勤率、作业待反馈、服务到期、预估毛利卡片。  
  **测试：** 无数据时展示空状态。  
  **完成记录：** 2026-05-02 新增 `AdminDashboard` 首页看板静态结构，覆盖今日到托、出勤率、作业待反馈、服务到期、预估毛利 5 张卡片；无数据时展示对应空状态，`/admin` 已接入默认空数据看板。  
  **TDD 记录：** 先新增 `tests/unit/admin-dashboard.test.tsx` 并运行失败，失败原因为看板组件不存在；实现 `components/admin/admin-dashboard.tsx` 后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-dashboard.test.tsx tests/unit/admin-layout.test.tsx`、`npm run typecheck`、`npm run lint`、`npm run test:unit`、`npm run prisma:validate`、`npm run build`、`npm run test:e2e`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-03 校区管理列表  
  **内容：** 校区列表、启用/停用状态、负责人。  
  **测试：** 校区筛选和状态筛选可用。  
  **完成记录：** 2026-05-02 新增 `AdminCampusList` 校区管理列表与 `/admin/campuses` 路由，展示校区名称、启用/停用状态、负责人、电话和地址；`filterCampusesForList` 支持关键词和状态筛选。  
  **TDD 记录：** 先新增 `tests/unit/admin-campus-list.test.tsx` 并运行失败，失败原因为校区列表组件和筛选 helper 不存在；实现 `components/admin/admin-campus-list.tsx` 与 `domain/admin/campus-list.ts` 后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-campus-list.test.tsx`、`npm run typecheck`、`npm run lint`、`npm run test:unit`、`npm run prisma:validate`、`npm run build`、`npm run test:e2e`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-04 校区新建/编辑表单  
  **内容：** 校区名称、地址、电话、负责人、服务类型。  
  **测试：** 必填项校验、停用校区业务限制。  
  **完成记录：** 2026-05-02 新增 `AdminCampusForm` 校区新建/编辑表单、`validateCampusFormInput` 校验 helper 和 `/admin/campuses/new` 路由；表单覆盖校区名称、地址、电话、负责人、服务时段、启停状态和四种固定服务类型；停用校区展示“停用校区不能新建学生或班级”业务限制。  
  **TDD 记录：** 先新增 `tests/unit/admin-campus-form.test.tsx` 并运行失败，失败原因为表单组件/domain helper 不存在；实现后单元测试通过。随后新增 `tests/e2e/admin-campus-form.spec.ts` 并先确认 `/admin/campuses/new` 缺失失败；实现路由后 E2E 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-campus-form.test.tsx`、`npm run test:e2e -- tests/e2e/admin-campus-form.spec.ts`、`npm run test:unit -- tests/unit/admin-campus-form.test.tsx tests/unit/admin-campus-list.test.tsx`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-05 学生列表  
  **内容：** 校区、班级、托管类型、状态、身份证脱敏。  
  **测试：** 老师/家长不能访问管理端学生全量列表。  
  **完成记录：** 2026-05-02 新增 `AdminStudentList` 学生档案列表、`domain/admin/student-list.ts` 管理端学生列表授权/校区过滤/身份证脱敏 helper 和 `/admin/students` 路由；列表展示校区、班级、托管类型、状态和脱敏身份证号。  
  **TDD 记录：** 先新增 `tests/unit/admin-student-list.test.tsx` 并运行失败，失败原因为学生列表组件/domain helper 不存在；实现后单元测试通过。随后新增 `tests/e2e/admin-student-list.spec.ts` 并先确认 `/admin/students` 缺失失败；实现路由后 E2E 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-student-list.test.tsx`、`npm run test:e2e -- tests/e2e/admin-student-list.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-06 学生新建/编辑表单  
  **内容：** 学生基础信息、校区、班级、托管类型、安全备注。  
  **测试：** 未选托管类型不能保存。  
  **完成记录：** 2026-05-02 新增 `AdminStudentForm` 学生新建/编辑表单、`validateStudentFormInput` 校验 helper 和 `/admin/students/new` 路由；表单覆盖学生姓名、身份证号、学校、年级、校区、班级、四种固定托管类型、学生状态和安全备注。  
  **TDD 记录：** 先新增 `tests/unit/admin-student-form.test.tsx` 并运行失败，失败原因为表单组件/domain helper 不存在；新增 `tests/e2e/admin-student-form.spec.ts` 并确认 `/admin/students/new` 缺失失败；实现后单元测试和 E2E 均通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-student-form.test.tsx`、`npm run test:e2e -- tests/e2e/admin-student-form.spec.ts`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-07 家长绑定管理  
  **内容：** 家长姓名、手机号、关系、通知开关。  
  **测试：** 家长绑定后只能看到对应孩子。  
  **完成记录：** 2026-05-02 新增 `AdminGuardianBinding` 家长绑定管理组件、`validateGuardianBindingInput`/`canGuardianAccessBoundStudent` helper 和 `/admin/guardians` 路由；表单覆盖家长姓名、手机号、关系、绑定学生和通知开关，并展示现有绑定。  
  **TDD 记录：** 先新增 `tests/unit/admin-guardian-binding.test.tsx` 并运行失败，失败原因为家长绑定组件/domain helper 不存在；新增 `tests/e2e/admin-guardian-binding.spec.ts` 并确认 `/admin/guardians` 缺失失败；实现后单元测试和 E2E 均通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-student-form.test.tsx tests/unit/admin-guardian-binding.test.tsx`、`npm run test:e2e -- tests/e2e/admin-student-form.spec.ts tests/e2e/admin-guardian-binding.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 15 个文件/51 个测试，E2E 9 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-08 班级管理列表  
  **内容：** 班级、校区、老师、容量、学生数、今日应到。  
  **测试：** 班级必须按校区隔离。  
  **完成记录：** 2026-05-02 新增 `AdminClassList` 班级管理列表、`domain/admin/class-list.ts` 班级列表授权/校区过滤 helper 和 `/admin/classes` 路由；列表展示班级、校区、年级、老师、学生数/容量和今日应到。  
  **TDD 记录：** 先新增 `tests/unit/admin-class-list.test.tsx` 并运行失败，失败原因为班级列表组件/domain helper 不存在；实现后单元测试通过。随后新增 `tests/e2e/admin-class-list.spec.ts` 覆盖页面路由与核心列展示，修正严格定位后通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-class-list.test.tsx`、`npm run test:e2e -- tests/e2e/admin-class-list.spec.ts`。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-09 班级分配老师和学生  
  **内容：** 选择老师、选择学生、容量提示。  
  **测试：** 不能跨未授权校区分配。  
  **完成记录：** 2026-05-02 新增 `AdminClassAssignmentPanel` 班级分配页面、`domain/admin/class-assignment.ts` 授权校区分配校验/可分配选项 helper 和 `/admin/classes/assignments` 路由；页面提供班级、老师、学生选择和容量提示。  
  **TDD 记录：** 先新增 `tests/unit/admin-class-assignment.test.tsx` 并运行失败，失败原因为分配组件/domain helper 不存在；实现后单元测试通过。随后新增 `tests/e2e/admin-class-assignment.spec.ts` 覆盖授权校区内选项展示和跨校区选项隐藏，通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-class-assignment.test.tsx`、`npm run test:e2e -- tests/e2e/admin-class-assignment.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 17 个文件/57 个测试，E2E 11 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M2-10 管理端 E2E：基础建档流程  
  **流程：** 新建校区 → 新建班级 → 新建学生 → 绑定家长 → 分配老师。  
  **测试：** Playwright 主流程通过。  
  **完成记录：** 2026-05-02 新增管理端基础建档主流程 E2E，覆盖校区新建入口、班级新建入口、学生新建入口、家长绑定页面和班级分配老师/学生页面；为流程补齐 `AdminClassForm` 与 `/admin/classes/new` 路由，并在班级列表增加“新建班级”入口。  
  **TDD 记录：** 先新增 `tests/e2e/admin-foundation-workflow.spec.ts` 并运行失败，失败原因为班级列表缺少“新建班级”入口；实现班级新建表单与路由后同一 E2E 通过。  
  **测试命令：** `npm run test:e2e -- tests/e2e/admin-foundation-workflow.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 19 个文件/63 个测试，E2E 12 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

---

### M3. 考勤、拍照签到与通知

- [x] M3-01 创建 AttendanceRecord 模型与 service  
  **内容：** 状态、时间、照片、匹配状态、通知状态、老师。  
  **测试：** 晚辅导通知文案必须是“已到托管中心”。  
  **完成记录：** 2026-05-02 已在 `prisma/schema.prisma` 新增 `AttendanceStatus`、`AttendanceMatchStatus`、`AttendanceNotificationStatus` 和 `AttendanceRecord` 模型，包含校区、班级、学生、老师、托管类型、状态、签到时间、照片文件引用、匹配状态和通知状态；新增 `domain/attendance/attendance-record.ts` 到托考勤草稿与通知文案 helper。  
  **TDD 记录：** 先新增 `tests/unit/attendance-record.test.ts` 并运行失败，失败原因为考勤 service 不存在；实现模型与 service 后单元测试和 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/attendance-record.test.ts`、`npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-02 创建 TeacherAttendance 模型与 service  
  **内容：** 老师签到、签退、迟到、早退、请假、补签。  
  **测试：** 老师只能给自己签到，管理员可补签。  
  **完成记录：** 2026-05-02 已在 `prisma/schema.prisma` 新增 `TeacherAttendanceStatus` 和 `TeacherAttendance` 模型，支持老师签到/签退、迟到、早退、请假、缺勤、补签以及管理员补签记录；新增 `domain/attendance/teacher-attendance.ts` 老师考勤草稿 helper，并扩展 `TEACHER_ATTENDANCE_STATUSES` 固定枚举。  
  **TDD 记录：** 先新增 `tests/unit/teacher-attendance.test.ts` 并运行失败，失败原因为老师考勤 service 不存在；实现模型与 service 后单元测试和 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/teacher-attendance.test.ts`、`npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-03 老师端今日托管页面  
  **内容：** 校区/班级/托管类型筛选、学生状态、服务到期提醒。  
  **测试：** 老师只能看到负责学生。  
  **完成记录：** 2026-05-02 新增 `TeacherTodayCustodyPage` 老师端今日托管页面、`domain/teacher/today-custody.ts` 授权过滤/筛选/服务到期提醒 helper，并将 `/teacher` 接入演示数据；页面展示校区/班级/托管类型筛选、学生状态和 7 天内服务到期提醒。  
  **TDD 记录：** 先新增 `tests/unit/teacher-today-custody.test.tsx` 并运行失败，失败原因为老师端今日托管组件/domain helper 不存在；先新增 `tests/e2e/teacher-today-custody.spec.ts` 并确认 `/teacher` 缺少“今日托管”失败；实现后单元测试和 E2E 均通过。  
  **测试命令：** `npm run test:unit -- tests/unit/teacher-today-custody.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-today-custody.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 20 个文件/69 个测试，E2E 13 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-04 老师签到/签退  
  **内容：** 到岗、离岗、今日负责校区班级。  
  **测试：** 重复签到处理、签退前必须已签到。  
  **完成记录：** 2026-05-02 扩展 `domain/attendance/teacher-attendance.ts`，新增 `createTeacherCheckInDraft` 与 `createTeacherCheckOutDraft`，处理重复签到、重复签退和未签到先签退；老师端工作台展示今日负责校区班级，并提供“到岗签到”“离岗签退”操作入口。  
  **TDD 记录：** 先扩展 `tests/unit/teacher-attendance.test.ts` 并运行失败，失败原因为签到/签退 helper 不存在；实现 helper 后通过。随后扩展 `tests/unit/teacher-today-custody.test.tsx` 先确认页面缺少到岗/离岗入口失败，实现页面入口后通过。  
  **测试命令：** `npm run test:unit -- tests/unit/teacher-attendance.test.ts`、`npm run test:unit -- tests/unit/teacher-today-custody.test.tsx tests/unit/teacher-attendance.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-05 学生考勤状态更新  
  **内容：** 已到、请假、缺勤、迟到、已离托、待确认。  
  **测试：** 状态流转符合业务规则。  
  **完成记录：** 2026-05-02 扩展 `domain/attendance/attendance-record.ts`，新增学生考勤状态流转校验与状态更新草稿；支持待确认确认到已到/迟到/请假/缺勤，已到/迟到后才能登记已离托，请假/缺勤和已离托按业务规则禁止直接回写到托。  
  **TDD 记录：** 先扩展 `tests/unit/attendance-record.test.ts` 并运行失败，失败原因为 `validateAttendanceStatusTransition` 与 `createStudentAttendanceStatusUpdateDraft` 不存在；实现最小 service 后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/attendance-record.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 21 个文件/75 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-06 文件上传基础服务  
  **内容：** 私有存储、metadata、授权读取 API。  
  **测试：** 未授权家长不能读取其他孩子照片。  
  **完成记录：** 2026-05-02 在 `prisma/schema.prisma` 新增 `FileVisibility` enum 与 `PrivateFile` 模型，记录校区、学生、上传人、私有 storageKey、mimeType、byteSize、用途和可见性；新增 `domain/files/private-file.ts` 私有文件 metadata 构造、授权读取判断和授权读取草稿，默认不生成公开 URL。  
  **TDD 记录：** 先新增 `tests/unit/file-storage.test.ts` 并运行失败，失败原因为私有文件 service/模型不存在；实现模型与 service 后单元测试和 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/file-storage.test.ts`、`npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 21 个文件/75 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-07 拍照签到上传  
  **内容：** 老师选择学生后上传到托照片。  
  **测试：** 生成 AttendanceRecord 和文件记录。  
  **完成记录：** 2026-05-02 新增 `domain/attendance/photo-check-in.ts` 拍照签到上传草稿服务，老师/助教必须通过负责学生权限校验；服务一次生成私有到托照片 metadata 和学生 `AttendanceRecord` 草稿，照片不生成公开 URL，未匹配照片默认抑制通知。  
  **TDD 记录：** 先新增 `tests/unit/photo-check-in-upload.test.ts` 并运行失败，失败原因为拍照签到上传 service 不存在；实现后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/photo-check-in-upload.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 24 个文件/83 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-08 家长到托通知记录  
  **内容：** 站内通知表、通知开关、照片缩略图引用。  
  **测试：** 家长关闭通知时只记录不推送。  
  **完成记录：** 2026-05-02 在 `prisma/schema.prisma` 新增 `NoticePushStatus` enum 和 `ParentNotice` 站内通知模型，记录家长、学生、考勤、照片引用、通知类型、标题、内容和推送状态；新增 `domain/notices/arrival-notice.ts` 到托通知草稿服务，家长关闭通知时仍生成站内记录但 `pushStatus=SUPPRESSED`。  
  **TDD 记录：** 先新增 `tests/unit/arrival-notice.test.ts` 并运行失败，失败原因为到托通知 service/模型不存在；实现模型与 service 后单元测试和 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/arrival-notice.test.ts`、`npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-09 匹配失败待确认流程  
  **内容：** 不自动通知，老师确认后补发。  
  **测试：** 待确认状态不会出现在家长通知中。  
  **完成记录：** 2026-05-02 新增 `domain/attendance/photo-match-confirmation.ts` 老师确认补发草稿服务，并扩展 `createArrivalNoticeDraftsFromAttendance`：只有 `matchStatus=MATCHED` 且 `notificationStatus=PENDING` 的到托考勤会生成家长通知，待确认/失败记录不会进入家长通知。  
  **TDD 记录：** 先新增 `tests/unit/photo-match-confirmation.test.ts` 并运行失败，失败原因为匹配确认 service 和通知过滤 helper 不存在；实现后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/photo-match-confirmation.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-10 家长端首页安全到达卡片  
  **内容：** 孩子状态、到托时间、托管类型、老师、照片。  
  **测试：** 家长只能看到绑定孩子。  
  **完成记录：** 2026-05-02 新增 `domain/parent/safety-arrival.ts` 家长首页安全到达卡片数据过滤 helper，复用 `canAccessStudent` 确保家长只能看到绑定孩子；新增 `components/parent/parent-home-safety-card.tsx` 并将 `/parent` 接入 demo 安全到达卡片，展示孩子状态、到托时间、托管类型、负责老师和照片引用。  
  **TDD 记录：** 先新增 `tests/unit/parent-safety-arrival-card.test.tsx` 并运行失败，失败原因为家长安全到达卡片组件/domain helper 不存在；实现后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/parent-safety-arrival-card.test.tsx`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 25 个文件/85 个测试，E2E 13 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-11 管理端考勤统计  
  **内容：** 按校区/班级/托管类型统计应到、实到、请假、缺勤。  
  **测试：** 校区管理员不能看其他校区。  
  **完成记录：** 2026-05-02 新增 `domain/admin/attendance-stats.ts` 管理端考勤统计聚合 helper、`AdminAttendanceStats` 统计表组件和 `/admin/attendance` 路由；按校区/班级/托管类型统计应到、实到、请假、缺勤和出勤率，并复用 `canAccessCampus` 确保校区管理员只能看到授权校区。  
  **TDD 记录：** 先新增 `tests/unit/admin-attendance-stats.test.tsx` 并运行失败，失败原因为组件/domain helper 不存在；新增 `tests/e2e/admin-attendance-stats.spec.ts` 并确认 `/admin/attendance` 缺失失败；实现后单元测试和 E2E 均通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-attendance-stats.test.tsx`、`npm run test:e2e -- tests/e2e/admin-attendance-stats.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 26 个文件/89 个测试，E2E 14 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

- [x] M3-12 E2E：拍照签到通知流程  
  **流程：** 老师签到 → 学生拍照签到 → 家长首页看到通知和照片。  
  **测试：** Playwright 通过。  
  **完成记录：** 2026-05-02 新增 `tests/e2e/photo-check-in-notification-flow.spec.ts` 覆盖老师端到岗签到、学生拍照签到确认、家长端安全到达卡片查看到托通知和私有照片引用；补充老师端学生卡片“拍照签到”入口、`/teacher/photo-check-in` 拍照签到确认页，并在家长安全到达卡片展示“已到托管中心”通知文案和私有照片引用。  
  **TDD 记录：** 先新增 E2E 并运行失败，失败原因为老师端缺少“为王小明拍照签到”入口；实现入口和拍照签到页后再次失败于家长端缺少“已到托管中心”文案；补齐家长安全到达卡片后同一 E2E 通过。  
  **测试命令：** `npm run test:e2e -- tests/e2e/photo-check-in-notification-flow.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 26 个文件/89 个测试，E2E 15 个测试）。  
  **提交记录：** 未提交；当前目录不是 Git 仓库。

---

### M4. 作业批改、AI 圈错草稿与三类反馈

- [x] M4-01 创建 HomeworkReview 模型  
  **内容：** 原图、批改图、学科、状态、AI 建议区域、老师确认区域、发布状态。  
  **测试：** 未发布记录家长不可见。  
  **完成记录：** 2026-05-02 新增 Prisma `HomeworkReview` 模型、状态/发布枚举和 `domain/homework/homework-review.ts` 草稿/可见性 helper；模型覆盖作业原图、批改图、学科、AI 建议区域、老师确认区域、发布状态，并关联校区、班级、学生、老师和私有文件。  
  **TDD 记录：** 先新增 `tests/unit/homework-review.test.ts` 并确认失败，失败原因为 `HomeworkReview` 模型和 domain helper 不完整；补齐模型与 helper 后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/homework-review.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 28 个文件/95 个测试，E2E 15 个测试）。  
  **提交记录：** 已提交到本地 Git；GitHub 远端待用户提供仓库或完成 SSH key 授权.

- [x] M4-02 创建 Feedback 模型  
  **内容：** 行为表现、作业完成、知识掌握、发布状态。  
  **测试：** 作业完成字段必填。  
  **完成记录：** 2026-05-02 新增 Prisma `Feedback` 模型、发布枚举和 `domain/feedback/feedback.ts` 三段反馈草稿/发布校验 helper；模型覆盖行为表现、作业完成、知识掌握、发布状态，并可关联作业批改记录。  
  **TDD 记录：** 先新增 `tests/unit/feedback.test.ts` 并确认失败，失败原因为 `domain/feedback/feedback` 不存在；实现 domain helper 与 Prisma 模型后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/feedback.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 28 个文件/95 个测试，E2E 15 个测试）。  
  **提交记录：** 已提交到本地 Git；GitHub 远端待用户提供仓库或完成 SSH key 授权.

- [x] M4-03 老师端选择学生上传作业  
  **内容：** 班级 → 学生 → 作业图片上传。  
  **测试：** 老师不能给非负责学生上传作业。  
  **完成记录：** 2026-05-02 新增 `domain/teacher/homework-upload.ts` 作业上传草稿服务、`TeacherHomeworkUploadPage` 老师端上传作业页面和 `/teacher/homework-upload` 路由；老师只能看到负责班级/学生，上传作业仅生成私有原图 metadata 与未发布 `HomeworkReview` 草稿。  
  **TDD 记录：** 先新增 `tests/unit/teacher-homework-upload.test.tsx` 并运行失败，失败原因为上传作业组件/domain helper 不存在；实现后单元测试通过。随后新增 `tests/e2e/teacher-homework-upload.spec.ts` 覆盖老师端上传页面，先因可见学生文本定位失败，补充页面可上传学生摘要后 E2E 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/teacher-homework-upload.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-homework-upload.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`。  
  **提交记录：** 已提交到本地 Git：`520327d feat(homework): complete M4-03 teacher upload`；GitHub 远端待用户提供仓库或完成 SSH key 授权。

- [x] M4-04 作业原图展示与批改画布  
  **内容：** 显示图片、支持区域框坐标。  
  **测试：** 图片比例和坐标保存一致。  
  **完成记录：** 2026-05-02 新增 `domain/homework/correction-canvas.ts` 批改区域坐标换算/比例校验 helper、`TeacherHomeworkCorrectionCanvas` 作业原图与批改区域 UI 组件、`/teacher/homework-correction` 老师端批改画布路由；MVP 以原图尺寸保存区域坐标，避免展示缩放导致错题区域偏移。  
  **TDD 记录：** 先新增 `tests/unit/homework-correction-canvas.test.tsx` 并运行失败，失败原因为批改画布 domain/component 不存在；实现后单元测试通过。随后新增 `tests/e2e/teacher-homework-correction.spec.ts` 并确认 `/teacher/homework-correction` 缺少页面失败；补齐路由后同一 E2E 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/homework-correction-canvas.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-homework-correction.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 30 个文件/102 个测试，E2E 17 个测试）。  
  **提交记录：** 已提交并推送 GitHub：`ed1cb49 feat(homework): add correction canvas`。

- [x] M4-05 AI 圈错建议 service stub  
  **内容：** 返回建议区域、学科、错因、置信度；MVP 可先用 mock provider。  
  **测试：** 低置信度提示老师手动确认。  
  **完成记录：** 2026-05-02 新增 `domain/homework/ai-mistake-suggestion.ts` AI 圈错建议 service stub 与 `mock-mistake-suggestion` provider，返回建议区域、学科、错因、置信度、置信度等级和老师确认提示；所有 AI 建议均标记为需老师确认，低置信度区域单独提示老师手动确认或调整。  
  **TDD 记录：** 先新增 `tests/unit/ai-mistake-suggestion.test.ts` 并运行失败，失败原因为 `@/domain/homework/ai-mistake-suggestion` 不存在；实现 mock provider/service 后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/ai-mistake-suggestion.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 31 个文件/105 个测试，E2E 17 个测试）。  
  **提交记录：** 已提交并推送 GitHub：`cae2bea feat(homework): add AI mistake suggestion stub`。

- [x] M4-06 老师确认/修改/忽略圈错区域  
  **内容：** 只有确认区域进入批改图和错题本。  
  **测试：** 未确认 AI 区域不会发布。  
  **完成记录：** 2026-05-02 新增 `domain/homework/mistake-area-confirmation.ts` 老师圈错区域决策 service，支持确认、修改、忽略 AI 圈错区域；只有确认/修改区域进入 `teacherConfirmedAreas` 与错题本候选，忽略和未确认 AI 区域不会发布。新增 `TeacherMistakeAreaReviewPanel` 并接入 `/teacher/homework-correction`，展示确认/修改/忽略操作入口和发布限制说明。  
  **TDD 记录：** 先新增 `tests/unit/homework-mistake-area-confirmation.test.tsx` 并运行失败，失败原因为决策 service 与确认组件不存在；随后新增 `tests/e2e/teacher-homework-mistake-area-confirmation.spec.ts` 并确认老师批改页缺少“AI 圈错确认”失败；实现 service、组件与页面接入后单元测试和 E2E 均通过。  
  **测试命令：** `npm run test:unit -- tests/unit/homework-mistake-area-confirmation.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-homework-mistake-area-confirmation.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 32 个文件/108 个测试，E2E 18 个测试）。  
  **提交记录：** 已提交到本地 Git：`fa1284b feat(homework): complete M4-06 mistake area confirmation`；计划状态补充提交 `dffcdda docs(plan): record M4-06 commit status`；GitHub push 已完成。

- [x] M4-07 三类点评编辑器  
  **内容：** 行为表现、作业完成、知识掌握；AI 草稿可编辑。  
  **测试：** 作业完成为空不能发布。  
  **完成记录：** 2026-05-02 新增 `createEditableFeedbackDraft` 与 `canPublishFeedbackDraft`，支持 AI/老师来源三类点评草稿保持 `DRAFT` 状态且不直接发布；新增 `TeacherHomeworkFeedbackEditor` 并接入 `/teacher/homework-correction`，老师可编辑行为表现、作业完成、知识掌握三类点评，发布按钮在作业完成点评为空时禁用并展示错误。  
  **TDD 记录：** 先新增 `tests/unit/homework-feedback-editor.test.tsx` 并运行失败，失败原因为 `TeacherHomeworkFeedbackEditor` 不存在；新增 `tests/e2e/teacher-homework-feedback-editor.spec.ts` 并确认老师批改页缺少“三类今日点评”失败；实现 domain helper、组件与页面接入后聚焦单元/E2E 测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/homework-feedback-editor.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-homework-feedback-editor.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 33 个文件/111 个测试，E2E 19 个测试）。  
  **提交记录：** 已提交到本地 Git：`32ba4bf feat(homework): add feedback editor draft`；计划状态补充提交 `5aed2ae docs(plan): record M4-07 commit status`；GitHub push 已完成。

- [x] M4-08 发布作业反馈  
  **内容：** 发布后家长可见原图、批改图、三类点评。  
  **测试：** 发布前家长不可见，发布后可见。  
  **完成记录：** 2026-05-02 新增 `domain/feedback/homework-feedback-publishing.ts` 发布 service，发布前要求老师确认后的批改图和非空作业完成点评；发布后将作业反馈与三类点评设为 `PUBLISHED`，并通过家长绑定关系生成家长可见投影。新增 `ParentHomeworkFeedbackCard` 并接入 `/parent`，家长仅看到作业原图、批改图和三类点评，不展示 AI 内部置信度或老师内部备注。  
  **TDD 记录：** 先新增 `tests/unit/homework-feedback-publishing.test.tsx` 并运行失败，失败原因为家长作业反馈组件/发布 service 不存在；新增 `tests/e2e/parent-homework-feedback-publishing.spec.ts` 并确认 `/parent` 缺少“今日作业反馈”失败；实现 service、组件与页面接入后聚焦单元/E2E 测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/homework-feedback-publishing.test.tsx`、`npm run test:e2e -- tests/e2e/parent-homework-feedback-publishing.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 34 个文件/115 个测试，E2E 20 个测试）。  
  **提交记录：** 已提交到本地 Git：`d00a31c feat(feedback): publish homework feedback to parents`；计划状态补充提交 `cce8f82 docs(plan): record M4-08 commit status`；GitHub push 已完成。

- [x] M4-09 家长端作业/考勤详情页  
  **内容：** 作业原图、批改图、三类点评、错题摘要。  
  **测试：** 不展示老师内部备注或 AI 未确认草稿。  
  **完成记录：** 2026-05-02 新增家长端作业/考勤详情页 `/parent/homework-feedback`，展示作业原图、批改图、三类点评、到托/离校时间线和错题摘要；家长端首页作业反馈卡片增加详情入口。详情数据通过 `createParentHomeworkFeedbackDetail` 聚合，并复用家长绑定权限校验，过滤 AI 未确认草稿、内部置信度和老师内部备注。  
  **TDD 记录：** 本轮开始时检测到该任务已有未提交测试与实现文件；未伪造 RED 结果。已补跑聚焦单元测试 `tests/unit/parent-homework-feedback-detail.test.tsx` 与聚焦 E2E `tests/e2e/parent-homework-feedback-detail.spec.ts`，确认家长仅能看到绑定学生的已发布详情，且不展示老师内部备注或 AI 未确认草稿。  
  **测试命令：** `npm run test:unit -- tests/unit/parent-homework-feedback-detail.test.tsx`、`npm run test:e2e -- tests/e2e/parent-homework-feedback-detail.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 35 个文件/118 个测试，E2E 21 个测试；首次完整门禁中的 lint 因 Playwright test-results 临时目录竞态 ENOENT 失败，单独重跑 lint 与完整门禁均通过）。  
  **提交记录：** 已提交到本地 Git：`7dd8d80 feat(parent): complete M4-09 homework feedback detail`；计划状态补充提交 `d0e426f docs(plan): record M4-09 commit status`；GitHub push 已完成。

- [x] M4-10 管理端作业反馈进度  
  **内容：** 按校区/班级查看待批改、待发布、已发布。  
  **测试：** 校区权限正确。  
  **完成记录：** 2026-05-02 新增 `domain/admin/homework-feedback-progress.ts` 管理端作业反馈进度聚合 helper、`AdminHomeworkFeedbackProgress` 进度表组件和 `/admin/homework-feedback` 路由；按校区/班级/托管类型展示待批改、待发布、已发布和发布率，并复用 `canAccessCampus` 确保校区管理员只能看到授权校区。  
  **TDD 记录：** 先新增 `tests/unit/admin-homework-feedback-progress.test.tsx` 并运行失败，失败原因为组件/domain helper 不存在；先新增 `tests/e2e/admin-homework-feedback-progress.spec.ts` 并确认 `/admin/homework-feedback` 缺少页面失败；实现 domain、组件和路由后聚焦单元/E2E 均通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-homework-feedback-progress.test.tsx`、`npm run test:e2e -- tests/e2e/admin-homework-feedback-progress.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 36 个文件/121 个测试，E2E 22 个测试）。  
  **提交记录：** 已提交到本地 Git：`086e343 feat(admin): complete M4-10 homework feedback progress`；计划状态补充提交 `4b0e32d docs(plan): record M4-10 commit status`；GitHub push 已完成。

- [x] M4-11 E2E：作业反馈发布流程  
  **流程：** 老师上传作业 → AI 建议 → 老师确认 → 发布 → 家长查看。  
  **测试：** Playwright 通过.  
  **完成记录：** 2026-05-02 新增 `tests/e2e/homework-feedback-publish-flow.spec.ts`，覆盖 `/teacher/homework-upload` 上传入口 → `/teacher/homework-correction` AI 圈错确认与三类点评发布 → `/parent/homework-feedback` 家长查看已发布作业与错题摘要。为保持 MVP 演示闭环，上传页增加“上传后状态：待 AI 圈错”和“进入 AI 批改确认”入口，AI 圈错确认区展示老师确认状态，发布区增加“查看家长端发布结果”，家长详情页展示“发布状态：老师已确认发布”。  
  **TDD 记录：** 先新增 M4-11 E2E 并运行失败，失败原因为上传页缺少“上传后状态：待 AI 圈错”和流程入口；最小补齐流程提示/链接/发布状态后聚焦 E2E 通过。  
  **测试命令：** `npm run test:e2e -- tests/e2e/homework-feedback-publish-flow.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 36 个文件/121 个测试，E2E 23 个测试）。  
  **提交记录：** 已提交到本地 Git：`30f1918 test(homework): cover feedback publish flow`；计划状态补充提交 `3f4ad10 docs(plan): record M4-11 commit status`；GitHub push 已完成。

---

### M5. 错题本与 Word 练习单

- [x] M5-01 创建 MistakeBookItem 模型  
  **内容：** 学生、作业来源、学科、知识点、错因、图片区域、订正状态。  
  **测试：** 只收录老师确认过的错题。  
  **完成记录：** 2026-05-02 新增 Prisma `MistakeBookItem` 模型和 `MistakeCorrectionStatus` 枚举，字段覆盖校区、班级、学生、作业来源、确认区域来源、学科、知识点、错因、图片区域、题干、订正状态、AI 置信度与订正时间；关联 `Campus`、`CustodyClass`、`Student`、`HomeworkReview` 并建立来源区域唯一约束。新增 `domain/mistake-book/mistake-book-item.ts`，仅从老师 `CONFIRMED` / `MODIFIED` 区域生成错题本草稿，忽略区域不会收录。  
  **TDD 记录：** 先新增 `tests/unit/mistake-book-item.test.ts` 并运行失败，失败原因为 `@/domain/mistake-book/mistake-book-item` 不存在；实现 Prisma 模型和 domain helper 后聚焦测试与 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/mistake-book-item.test.ts`、`npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 37 个文件/123 个测试，E2E 23 个测试）。  
  **提交记录：** 已提交到本地 Git：`d3be157 feat(mistake-book): add item model`；计划状态补充提交 `b44ea9a docs(plan): record M5-01 commit status`；GitHub push 已完成。

- [x] M5-02 作业发布后自动收录错题  
  **内容：** 根据 confirmedAreas 创建错题记录。  
  **测试：** 忽略区域不生成错题。  
  **完成记录：** 2026-05-02 新增 `collectMistakeBookItemsAfterFeedbackPublish` post-publish 收录服务，复用 M5-01 的 `createMistakeBookItemsFromConfirmedAreas`，仅在作业反馈已发布且存在发布时间后，根据老师确认/修改的错题区域生成待创建错题；忽略区域不会生成错题。通过 `homeworkReviewId:sourceAreaId` 自然键过滤既有错题，重复发布同一作业反馈不会重复创建。  
  **TDD 记录：** 先新增 `tests/unit/mistake-book-collection.test.ts` 并运行失败，失败原因为 `collectMistakeBookItemsAfterFeedbackPublish is not a function`；最小实现发布后收录与重复键过滤后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/mistake-book-collection.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 38 个文件/125 个测试，E2E 23 个测试）。  
  **提交记录：** 已提交到本地 Git：`d9b0460 feat(mistake-book): collect items after publish`；计划状态补充提交 `e020847 docs(plan): record M5-02 commit status`；GitHub push 已完成。

- [x] M5-03 老师端错题本页面  
  **内容：** 按学生、学科、知识点、日期筛选。  
  **测试：** 老师只能访问负责学生错题。  
  **完成记录：** 2026-05-02 新增 `domain/teacher/mistake-book.ts`、`components/teacher/teacher-mistake-book-page.tsx` 和 `/teacher/mistake-book` 页面，老师端可查看已收录错题，页面提供学生、学科、知识点、日期筛选入口，并展示学生、班级、学科、知识点、错因、题目快照、订正状态和收录日期。读取逻辑复用 `canAccessStudent`，只返回老师负责校区/班级内学生错题。  
  **TDD 记录：** 先新增 `tests/unit/teacher-mistake-book.test.tsx` 与 `tests/e2e/teacher-mistake-book.spec.ts`，首次运行失败，失败原因为老师端错题本 domain/page 尚不存在；最小实现 domain 过滤、组件和路由后聚焦单测/E2E 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/teacher-mistake-book.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-mistake-book.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 39 个文件/128 个测试，E2E 24 个测试）。  
  **提交记录：** 已提交到本地 Git：`00d4b16 feat(teacher): add mistake book page`；计划状态补充提交 `2ef905b docs(plan): record M5-03 commit status`；GitHub push 已完成。

- [x] M5-04 学生端错题本页面  
  **内容：** 查看自己的错题、订正状态、AI 讲解入口。  
  **测试：** 学生只能访问自己的错题。  
  **完成记录：** 2026-05-02 新增 `domain/student/mistake-book.ts`、`components/student/student-mistake-book-page.tsx` 和 `/student/mistake-book` 页面，学生端可查看自己的错题、题目快照、错因、订正状态和 AI 讲解入口。读取逻辑复用 `canAccessStudent` 的 student self-record 判断，其他学生错题不会显示。  
  **TDD 记录：** 先新增 `tests/unit/student-mistake-book.test.tsx` 与 `tests/e2e/student-mistake-book.spec.ts`，首次运行失败，失败原因为学生端错题本组件/domain/page 尚不存在；最小实现后聚焦单测/E2E 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/student-mistake-book.test.tsx`、`npm run test:e2e -- tests/e2e/student-mistake-book.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 40 个文件/130 个测试，E2E 25 个测试）。  
  **提交记录：** 已提交并推送 GitHub：`97684a4 feat(student): add mistake book page`.

- [x] M5-05 AI 同类题生成草稿  
  **内容：** 基于错题生成 3 道同类题草稿。  
  **测试：** 生成结果必须老师确认。  
  **完成记录：** 2026-05-02 新增 `domain/mistake-book/similar-question-draft.ts`，基于错题生成 3 道同类题草稿；生成结果默认 `DRAFT`，标记 `requiresTeacherConfirmation=true`，且确认前 `canAddToWorksheet=false`，不能直接进入练习单。  
  **TDD 记录：** 先新增 `tests/unit/similar-question-draft.test.ts` 并运行失败，失败原因为 `@/domain/mistake-book/similar-question-draft` 不存在；实现最小生成服务后同一测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/similar-question-draft.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 41 个文件/132 个测试，E2E 25 个测试）。  
  **提交记录：** 已提交并推送 GitHub：`45a93ea feat(mistake-book): generate similar question drafts`.

- [x] M5-06 老师勾选同类题  
  **内容：** 可选题目、编辑题干、保存练习单草稿。  
  **测试：** 未勾选题目不能生成 Word。  
  **完成记录：** 2026-05-02 新增 `domain/mistake-book/practice-sheet-draft.ts`、`components/teacher/teacher-practice-sheet-draft-page.tsx` 和 `/teacher/practice-sheet` 页面；老师可查看 AI 同类题、勾选入练习单、编辑题干并保存练习单草稿，未勾选时阻止 Word 生成。  
  **TDD 记录：** 先新增 `tests/unit/practice-sheet-draft.test.ts`、`tests/unit/teacher-practice-sheet-draft.test.tsx` 和 `tests/e2e/teacher-practice-sheet-draft.spec.ts`，首次运行失败，失败原因为练习单草稿 domain/component/page 尚不存在；最小实现后聚焦单测和 E2E 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/practice-sheet-draft.test.ts tests/unit/teacher-practice-sheet-draft.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-practice-sheet-draft.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 43 个文件/136 个测试，E2E 26 个测试）。  
  **提交记录：** 已提交到本地 Git：`07a8e15 feat(mistake-book): save practice sheet drafts`；计划状态补充提交 `f77dfe5 docs(plan): record M5-06 commit status`；GitHub push 已完成。

- [x] M5-07 Word 练习单生成  
  **内容：** 学生、班级、日期、学科、错题摘要、同类题、答题区域、备注。  
  **测试：** 生成 `.docx` 文件，文件 metadata 可追溯。  
  **完成记录：** 2026-05-02 新增 `domain/mistake-book/practice-sheet-docx.ts`，基于练习单草稿生成 Word `.docx` Buffer，内容包含学生、班级、学科、生成时间、错题摘要、同类题、答题区域和备注；同时生成 `PRACTICE_DOCX` 私有文件元数据与 trace，可追溯草稿、学生、班级、错题来源、练习题和生成老师。  
  **TDD 记录：** 先新增 `tests/unit/practice-sheet-docx.test.ts`，首次运行失败，失败原因为 `@/domain/mistake-book/practice-sheet-docx` 不存在；最小实现后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/practice-sheet-docx.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 44 个文件/138 个测试，E2E 26 个测试）。  
  **提交记录：** 已提交到本地 Git：`1b340ee feat(mistake-book): generate practice sheet docx`；计划状态补充提交 `a19bcf4 docs(plan): record M5-07 commit status`；GitHub push 已完成。

- [x] M5-08 家长端错题摘要  
  **内容：** 家长可看孩子错题摘要，不看 AI 内部置信度细节。  
  **测试：** 家长只能看绑定孩子。  
  **完成记录：** 2026-05-02 新增 `domain/parent/mistake-summary.ts` 和 `components/parent/parent-mistake-summary-card.tsx`，并接入 `/parent`；家长端仅展示绑定孩子的错题摘要、学科、知识点和订正状态，不展示 AI 置信度等内部字段。  
  **TDD 记录：** 先新增 `tests/unit/parent-mistake-summary.test.tsx` 并运行失败，失败原因为家长错题摘要 domain/component 尚不存在；最小实现后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/parent-mistake-summary.test.tsx`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（首次 E2E 因新增家长错题摘要导致旧签到流 `王小明` 文本定位严格模式冲突，已将断言收敛到安全到达卡片；复跑 `npm run test:e2e` 通过，unit 45 个文件/140 个测试，E2E 26 个测试）。  
  **提交记录：** 已提交到本地 Git：`8cb9ce8 feat(parent): add mistake summary card`；计划状态补充提交 `ccf790e docs(plan): record M5-08 commit status`；GitHub push 已完成.

- [x] M5-09 E2E：错题到练习单流程  
  **流程：** 发布作业 → 错题收录 → AI 生成同类题 → 老师勾选 → 下载 Word。  
  **测试：** Playwright 或集成测试通过。  
  **完成记录：** 2026-05-02 新增 `tests/e2e/mistake-to-practice-sheet-flow.spec.ts`，串通 `/teacher/homework-upload` → `/teacher/homework-correction` → `/teacher/mistake-book` → `/teacher/practice-sheet`；补齐发布后自动收录错题入口、错题卡片生成同类题练习单入口、练习单 Word 下载与文件追溯展示。  
  **TDD 记录：** 先新增 E2E 并运行失败，失败原因为批改页尚未暴露“发布后将自动收录错题”与错题本入口；补齐最小 UI 链路后聚焦 E2E 通过。  
  **测试命令：** `npm run test:e2e -- tests/e2e/mistake-to-practice-sheet-flow.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 45 个文件/140 个测试，E2E 27 个测试）。  
  **提交记录：** 已提交到本地 Git：`5464f15 test(mistake-book): cover practice sheet flow`；计划状态补充提交 `3c7be43 docs(plan): record M5-09 commit status`；GitHub push 已完成.

---

### M6. 收费、服务有效期与班级核算

- [x] M6-01 创建 BillingRecord 模型  
  **内容：** 校区、学生、托管类型、月缴/学期缴、周期、应收、实收、余额/欠费、到期时间。  
  **测试：** 家长查询只返回服务有效期，不返回金额。  
  **完成记录：** 2026-05-02 新增 Prisma `BillingCycle` enum 与 `BillingRecord` 模型，关联 `Campus`、`Student`、`CustodyClass`，覆盖校区/学生/班级/托管类型/缴费周期/到期时间索引；新增 `domain/billing/service-validity.ts`，家长 projection 复用 `canAccessStudent`，只返回绑定孩子服务有效期与状态文案，不返回应收、实收、余额、欠费金额。  
  **TDD 记录：** 先新增 `tests/unit/billing-record.test.ts` 并运行失败，失败原因为 BillingRecord 模型和家长有效期 projection 尚不存在；最小实现后聚焦测试与 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/billing-record.test.ts && npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 46 个文件/142 个测试，E2E 27 个测试）。  
  **提交记录：** 已提交到本地 Git：`d09381d feat(billing): add billing record model`；计划状态补充提交 `0f96a6e docs(plan): record M6-01 commit status`；GitHub push 已完成.

- [x] M6-02 创建 TeacherFeeRule / 简化课费配置  
  **内容：** MVP 可按班级/老师/服务类型配置固定课费或日课费。  
  **测试：** 核算能读取课费基础。  
  **完成记录：** 2026-05-02 新增 Prisma `TeacherFeeBillingMode` enum 与 `TeacherFeeRule` 模型，支持按校区、班级、老师、托管类型配置班级固定课费或日课费；新增 `domain/billing/teacher-fee-rule.ts`，为班级核算读取生效课费基础，并优先使用班级级规则，避免跨校区/跨服务类型匹配。  
  **TDD 记录：** 先新增 `tests/unit/teacher-fee-rule.test.ts` 并运行失败，失败原因为 `@/domain/billing/teacher-fee-rule` 不存在；实现 Prisma 模型与 domain helper 后聚焦测试和 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/teacher-fee-rule.test.ts && npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 48 个文件/147 个测试）。  
  **提交记录：** 已提交到本地 Git：`babfde6 feat(billing): complete teacher fee and settlement models`；计划状态补充提交待完成。

- [x] M6-03 创建 ClassSettlement 模型  
  **内容：** 应到、实到、请假/缺勤、学生收入、老师课费、预估毛利、成本预留。  
  **测试：** 按校区和托管类型核算。  
  **完成记录：** 2026-05-02 新增 Prisma `ClassSettlement` 模型，覆盖应到、实到、请假、缺勤、学生收入、老师课费、成本预留和预估毛利，并按校区/班级/托管类型/日期唯一；新增 `domain/billing/class-settlement.ts`，按校区、班级和托管类型汇总出勤收入，读取 M6-02 老师课费规则计算毛利。  
  **TDD 记录：** 先新增 `tests/unit/class-settlement.test.ts` 并运行失败，失败原因为 `@/domain/billing/class-settlement` 不存在；实现模型与核算 service 后聚焦测试和 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/class-settlement.test.ts && npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 48 个文件/147 个测试）。  
  **提交记录：** 已提交到本地 Git：`babfde6 feat(billing): complete teacher fee and settlement models`；计划状态补充提交待完成。

- [x] M6-04 管理端收费记录页面  
  **内容：** 学生服务周期、缴费周期、到期时间、应收实收。  
  **测试：** 校区管理员仅看本校区。  
  **完成记录：** 2026-05-02 新增 `domain/admin/billing-records.ts` 管理端收费记录授权/格式化 helper、`AdminBillingRecords` 收费记录表组件和 `/admin/billing` 路由；页面展示学生服务周期、缴费周期、到期时间、应收和实收，并在管理端侧边栏增加收费记录入口。  
  **TDD 记录：** 先新增 `tests/unit/admin-billing-records.test.tsx` 并运行失败，失败原因为收费记录组件/domain helper 不存在；实现 domain、组件和路由后聚焦单元测试通过。新增 `tests/e2e/admin-billing-records.spec.ts` 覆盖页面与校区隔离，路由实现后通过。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-billing-records.test.tsx`、`npm run test:e2e -- tests/e2e/admin-billing-records.spec.ts`、任务级回归 `npm run test:unit -- tests/unit/admin-billing-records.test.tsx tests/unit/admin-layout.test.tsx && npm run test:e2e -- tests/e2e/admin-billing-records.spec.ts`。  
  **提交记录：** 已提交到本地 Git：`7a912d5 feat(billing): add admin billing records page`；计划状态补充提交：`docs(plan): record M6-04 commit status`。

- [x] M6-05 服务到期提醒计算  
  **内容：** 到期前一次、到期当天一次，逾期后人工提醒。  
  **测试：** 7 天内到期列表正确。  
  **完成记录：** 2026-05-02 扩展 `domain/billing/service-validity.ts`，新增 `getServiceExpiryReminders`，按 UTC 日期计算 7 天内到期列表；区分到期前自动提醒、到期当天自动提醒和逾期人工跟进，返回 DTO 不包含应收、实收、余额、欠费等金额字段。  
  **TDD 记录：** 先新增 `tests/unit/service-expiry-reminders.test.ts` 并运行失败，失败原因为 `getServiceExpiryReminders is not a function`；实现最小提醒计算后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/service-expiry-reminders.test.ts`、任务级回归 `npm run test:unit -- tests/unit/service-expiry-reminders.test.ts tests/unit/teacher-today-custody.test.tsx`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 50 个文件/153 个测试，E2E 28 个测试）。  
  **提交记录：** 已提交到本地 Git：`adaebd0 feat(billing): add service expiry reminders`；计划状态补充提交 `87d585c docs(plan): record M6-05 M6-06 commit status`；GitHub push 已完成.

- [x] M6-06 老师端服务到期提醒  
  **内容：** 仅展示学生服务到期/欠费提醒，不展示班级毛利。  
  **测试：** 老师端不出现毛利字段。  
  **完成记录：** 2026-05-02 在 `TeacherTodayCustodyPage` 增加老师端“服务到期提醒”区块，仅基于老师负责学生展示服务到期/续费跟进提示，不展示经营、收费金额或毛利字段。  
  **TDD 记录：** 先扩展 `tests/unit/teacher-today-custody.test.tsx` 并运行失败，失败原因为页面缺少“服务到期提醒”标题；实现提醒区块并修正提示文案避免出现毛利字段后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/teacher-today-custody.test.tsx`、`npm run test:e2e -- tests/e2e/teacher-today-custody.spec.ts`、任务级回归 `npm run test:unit -- tests/unit/service-expiry-reminders.test.ts tests/unit/teacher-today-custody.test.tsx`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 50 个文件/153 个测试，E2E 28 个测试）。  
  **提交记录：** 已提交到本地 Git：`adaebd0 feat(billing): add service expiry reminders`；计划状态补充提交 `87d585c docs(plan): record M6-05 M6-06 commit status`；GitHub push 已完成.

- [x] M6-07 家长端服务有效期展示  
  **内容：** “当前服务有效期至 YYYY-MM-DD”或续费提示。  
  **测试：** 家长端不出现余额、欠费金额。  
  **完成记录：** 2026-05-02 新增 `ParentServiceValidityCard` 并接入 `/parent`，复用 `getGuardianVisibleServiceValidity`，家长端只展示绑定孩子、托管类型和“当前服务有效期至 YYYY-MM-DD”，不展示余额、欠费、应收、实收或金额字段。  
  **TDD 记录：** 先新增 `tests/unit/parent-service-validity-card.test.tsx` 并运行失败，失败原因为家长服务有效期组件不存在；最小实现组件并接入家长首页后聚焦单测通过。新增 `tests/e2e/parent-service-validity.spec.ts` 覆盖 `/parent` 可见性。  
  **测试命令：** `npm run test:unit -- tests/unit/parent-service-validity-card.test.tsx`、`npm run test:e2e -- tests/e2e/parent-service-validity.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 51 个文件/154 个测试，E2E 29 个测试）。  
  **提交记录：** 已提交到本地 Git：`ec0a372 feat(parent): show service validity`；计划状态补充提交 `5c92823 docs(plan): record M6-07 commit status`；GitHub push 已完成.

- [x] M6-08 班级核算计算 service  
  **内容：** 从学生出勤和老师考勤汇总收入、课费、毛利。  
  **测试：** 请假/缺勤对核算影响符合规则。  
  **完成记录：** 2026-05-02 补齐 `calculateClassSettlementDraft` 的待确认出勤核算，班级核算按校区/班级/托管类型筛选学生和老师考勤；仅 `已到`、`迟到`、`已离托` 计入学生收入，`请假`、`缺勤`、`待确认` 不计收入但分别进入统计，老师课费按有效老师考勤与 `TeacherFeeRule` 汇总，毛利 = 学生收入 - 老师课费 - 预留成本。Prisma `ClassSettlement` 新增 `pendingCount` 用于留痕待确认人数。  
  **TDD 记录：** 先扩展 `tests/unit/class-settlement.test.ts` 加入无出勤记录的待确认学生，并断言 `pendingCount` 与收入排除规则；聚焦测试 RED 失败于 schema/返回值缺少 `pendingCount`；最小实现后聚焦测试和 `prisma:validate` 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/class-settlement.test.ts`（RED 后 GREEN）、`npm run test:unit -- tests/unit/class-settlement.test.ts && npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 51 个文件/154 个测试，E2E 29 个测试）。  
  **提交记录：** 已提交到本地 Git：`2dad526 feat(billing): track pending settlement count`；计划状态补充提交 `59a955f docs(plan): record M6-08 commit status`；GitHub push 已完成.

- [x] M6-09 管理端班级核算页面  
  **内容：** 按校区、日期、班级、托管类型、老师筛选。  
  **测试：** 总校长可全部汇总，校区管理员限校区。  
  **完成记录：** 2026-05-02 新增 `/admin/settlements` 管理端班级核算页面、`AdminClassSettlements` 组件和 `domain/admin/class-settlements.ts` projection；页面展示校区、日期、班级、托管类型、老师筛选入口，以及出勤统计、学生收入、老师课费、预留成本、毛利。总校长/总部管理员可汇总全部授权范围，校区管理员按 `canAccessCampus` 限定本校区，老师/家长不可查看。管理端侧边栏新增“班级核算”入口。  
  **TDD 记录：** 先新增 `tests/unit/admin-class-settlements.test.tsx` 和 `tests/e2e/admin-class-settlements.spec.ts`；聚焦单测 RED 失败于组件/domain 缺失；实现 domain、组件、页面和导航后聚焦单测/E2E 通过。曾遇到 Playwright `getByLabel('校区筛选')` 与顶部校区筛选重名导致 strict-mode 失败，已改为 exact locator。  
  **测试命令：** `npm run test:unit -- tests/unit/admin-class-settlements.test.tsx`（RED 后 GREEN）、`npm run test:unit -- tests/unit/admin-class-settlements.test.tsx && npm run test:e2e -- tests/e2e/admin-class-settlements.spec.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 52 个文件/157 个测试，E2E 30 个测试）。  
  **提交记录：** 已提交到本地 Git：`bdf9300 feat(admin): add class settlements page`；计划状态补充提交 `bff0084 docs(plan): record M6-09 commit status`；后续 M6-10/M7 计划提交已推送，GitHub push 已完成.

- [x] M6-10 E2E：收费与核算可见性  
  **流程：** 管理员录入收费 → 家长看有效期 → 老师看到期提醒 → 管理员看毛利。  
  **测试：** 不同角色字段可见性正确。  
  **完成记录：** 2026-05-02 新增 `tests/e2e/billing-settlement-visibility-flow.spec.ts`，串通 `/admin/billing` 收费录入结果 → `/parent` 服务有效期 → `/teacher` 服务到期提醒 → `/admin/settlements` 班级核算；验证校区管理员仅看授权校区，家长端不出现余额/欠费/应收/实收/毛利，老师端不出现毛利或金额，管理端可查看毛利。为流程补充 `AdminBillingRecords` 的“收费录入结果”提示区，明确收费录入会同步家长有效期与班级核算。  
  **TDD 记录：** 先新增 M6-10 E2E 并运行失败，失败原因为收费记录页缺少“收费录入结果”流程提示；最小补齐提示区后，调整严格定位到表格单元并重跑聚焦 E2E 通过。  
  **测试命令：** `npm run test:e2e -- tests/e2e/billing-settlement-visibility-flow.spec.ts`（RED 后 GREEN）、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 52 个文件/157 个测试，E2E 31 个测试）。  
  **提交记录：** 已提交到本地 Git：`85d4503 test(billing): cover settlement visibility flow`；计划状态补充提交 `345aad9 docs(plan): record M6-10 commit status`；GitHub push 已完成。

---

### M7. AI Command Layer 与审计

- [x] M7-01 创建 AiActionLog 模型  
  **内容：** 用户、角色、原始输入、意图、实体、置信度、风险、确认、结果、失败原因。  
  **测试：** 每次 AI 调用都记录日志。  
  **完成记录：** 2026-05-02 新增 Prisma `AiActionLog` 模型、`AiIntent`、`AiRiskLevel`、`AiActionResultStatus` 枚举，并关联 `User.aiActionLogs`；新增 `domain/ai-command/ai-action-log.ts`，统一构造 AI 操作日志 payload，并提供 `withAiActionLogging` 包装器确保 AI 调用成功或失败都会持久化日志。  
  **TDD 记录：** 先新增 `tests/unit/ai-action-log.test.ts` 并运行失败，失败原因为 `@/domain/ai-command/ai-action-log` 不存在；实现模型与 domain helper 后聚焦测试和 Prisma validate 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/ai-action-log.test.ts && npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 54 个文件/162 个测试）。  
  **提交记录：** 已提交到本地 Git：`2998aab feat(ai): add action logging and provider foundation`；计划状态补充提交 `7f7e4f1 docs(plan): record M7-01 M7-02 commit status`；GitHub push 已完成。

- [x] M7-02 创建 AiProvider 接口  
  **内容：** `generateJson`、`generateText`、`analyzeImage` 抽象。  
  **测试：** mock provider 可用于测试。  
  **完成记录：** 2026-05-02 新增 `domain/ai-command/ai-provider.ts`，定义 `AiProvider` 的 `generateJson`、`generateText`、`analyzeImage` 三类可插拔能力，并提供记录调用参数的 `createMockAiProvider`，便于后续 AI Command Layer 在单元测试中不触碰外部 AI 服务。  
  **TDD 记录：** 先新增 `tests/unit/ai-provider.test.ts` 并运行失败，失败原因为 `@/domain/ai-command/ai-provider` 不存在；实现接口与 mock provider 后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/ai-provider.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 54 个文件/162 个测试）。  
  **提交记录：** 已提交到本地 Git：`2998aab feat(ai): add action logging and provider foundation`；计划状态补充提交 `7f7e4f1 docs(plan): record M7-01 M7-02 commit status`；GitHub push 已完成。

- [x] M7-03 创建意图识别 schema  
  **内容：** 9 个 MVP 意图：queryAttendance、queryHomework、createLeaveRequest、queryBilling、sendTeacherMessage、recordHomeworkFeedback、suggestMistakeAreas、generateSimilarQuestions、queryClassSettlement。  
  **测试：** 未知意图降级到人工/传统页面。  
  **完成记录：** 2026-05-02 新增 `domain/ai-command/ai-intent-schema.ts`，用 zod 定义 9 个 MVP 意图识别 schema 与各意图实体 schema；未知意图、低置信度和实体不完整统一降级到人工/传统页面，不执行业务写入。  
  **TDD 记录：** 先新增 `tests/unit/ai-intent-schema.test.ts` 并运行失败，失败原因为 `@/domain/ai-command/ai-intent-schema` 不存在；实现 schema 与解析 helper 后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/ai-intent-schema.test.ts`（RED 后 GREEN）、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 56 个文件/168 个测试）。  
  **提交记录：** 已提交到本地 Git：`3aa935a feat(ai): add intent schema and risk classifier`；计划状态补充提交 `b878860 docs(plan): record M7-03 M7-04 commit status`；GitHub push 已完成。

- [x] M7-04 创建 RiskClassifier
  **内容：** 低风险查询、中风险确认、高风险拒绝。  
  **测试：** 修改收费、删除学生、批量通知均为高风险。  
  **完成记录：** 2026-05-02 新增 `domain/ai-command/risk-classifier.ts`，将只读查询归为低风险，正常业务写入归为中风险并要求确认；识别修改收费/余额/欠费/课费、删除学生、批量通知等高风险指令并拒绝执行，引导传统页面人工复核。  
  **TDD 记录：** 先新增 `tests/unit/risk-classifier.test.ts` 并运行失败，失败原因为 `@/domain/ai-command/risk-classifier` 不存在；实现最小风险分类器后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/risk-classifier.test.ts`（RED 后 GREEN）、`npm run test:unit -- tests/unit/ai-intent-schema.test.ts tests/unit/risk-classifier.test.ts`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate`（全部通过，unit 56 个文件/168 个测试）。  
  **提交记录：** 已提交到本地 Git：`3aa935a feat(ai): add intent schema and risk classifier`；计划状态补充提交 `b878860 docs(plan): record M7-03 M7-04 commit status`；GitHub push 已完成。

- [x] M7-05 创建 ConfirmationRequest 模型/服务  
  **内容：** 中风险动作生成确认卡片，确认后执行 domain service。  
  **测试：** 未确认不能写入业务数据。  
  **完成记录：** 2026-05-02 新增 Prisma `ConfirmationRequestStatus` 枚举与 `ConfirmationRequest` 模型，记录 actor、意图、风险、原始输入、确认卡片 payload/summary、状态、确认人、确认时间、执行时间和过期时间；新增 `domain/ai-command/confirmation-request.ts`，支持构造中风险 AI 确认卡片、人工确认后执行 domain service，未确认状态会拒绝业务写入。  
  **TDD 记录：** 先新增 `tests/unit/confirmation-request.test.ts` 并运行失败，失败原因为 `@/domain/ai-command/confirmation-request` 不存在；实现模型与 service 后聚焦测试和 `prisma:validate` 通过。  
  **测试命令：** `npm run test:unit -- tests/unit/confirmation-request.test.ts`（RED 后 GREEN）、`npm run test:unit -- tests/unit/confirmation-request.test.ts && npm run prisma:validate`、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 57 个文件/171 个测试，E2E 31 个测试）。  
  **提交记录：** 已提交到本地 Git：`b1da46b feat(ai): add confirmation request service`；计划状态补充提交 `647b0ba docs(plan): record M7-05 commit status`；GitHub push 已完成。

- [x] M7-06 家长 AI：查询考勤  
  **内容：** 返回绑定孩子到托状态和照片入口。  
  **测试：** 不能查询其他孩子。  
  **完成记录：** 2026-05-02 新增 `domain/ai-command/guardian-attendance-query.ts`，家长 AI `queryAttendance` 作为低风险查询直接返回授权绑定孩子的到托状态、服务类型、签到时间和签到照片入口；即使 AI 实体指定其他学生，也会通过 `canAccessStudent` 与 `guardianStudentIds` 过滤为空，不泄露其他孩子考勤或照片。  
  **TDD 记录：** 先新增 `tests/unit/guardian-attendance-query.test.ts` 并运行失败，失败原因为 `@/domain/ai-command/guardian-attendance-query` 不存在；实现最小查询 service 后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/guardian-attendance-query.test.ts`（RED 后 GREEN）、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 58 个文件/173 个测试，E2E 31 个测试）。  
  **提交记录：** 已提交到本地 Git：`b9296a1 feat(ai): add guardian attendance query`；计划状态补充提交 `287e787 docs(plan): record M7-06 commit status`；GitHub push 已完成。

- [x] M7-07 家长 AI：查询作业  
  **内容：** 返回已发布作业状态、三类点评摘要。  
  **测试：** 不返回未发布草稿。  
  **完成记录：** 2026-05-02 新增 `domain/ai-command/guardian-homework-query.ts`，家长 AI `queryHomework` 作为低风险查询，只基于 `getGuardianVisibleHomeworkFeedback` 返回授权绑定孩子的已发布作业状态、发布时间、作业完成、行为表现、知识掌握摘要；未发布草稿、其他孩子作业和老师内部草稿均不会出现在响应中。  
  **TDD 记录：** 先新增 `tests/unit/guardian-homework-query.test.ts` 并运行失败，失败原因为 `@/domain/ai-command/guardian-homework-query` 不存在；实现最小查询 service 后聚焦测试通过。  
  **测试命令：** `npm run test:unit -- tests/unit/guardian-homework-query.test.ts`（RED 后 GREEN）、本轮质量门禁 `npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`（全部通过，unit 59 个文件/175 个测试，E2E 31 个测试）。  
  **提交记录：** 已提交到本地 Git：`fb82a41 feat(ai): add guardian homework query`；计划状态补充提交 `e99d96a docs(plan): record M7-07 commit status`；GitHub push 已完成。

- [x] M7-08 家长 AI：请假确认卡片  
  **内容：** 解析时间、学生、原因，确认后创建请假记录。  
  **测试：** 确认前不写入。  
  **完成记录：** 2026-05-02 新增 `domain/ai-command/guardian-leave-request.ts`，家长 AI `createLeaveRequest` 会基于已解析学生、日期、服务类型和原因生成中风险确认卡片；确认前复用 `executeConfirmedRequest` 阻断任何请假写入，确认后才生成 `status: 请假` 的考勤草稿；同时复用 `canAccessStudent` 防止家长为非绑定学生创建请假申请。新增 `tests/unit/guardian-leave-request.test.ts` 覆盖确认前不写入、确认后生成请假考勤草稿、非绑定学生拒绝。全量质量门禁通过：`npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`。  
  **提交记录：** 已提交到本地 Git：`b235618 feat(ai): add guardian leave confirmation`；计划状态补充提交 `4c553db docs(plan): record M7-08 commit status`；GitHub push 已完成。

- [x] M7-09 家长 AI：留言老师确认卡片  
  **内容：** 生成留言确认，确认后发给负责老师。  
  **测试：** 留言只发给授权老师。  
  **完成记录：** 2026-05-02 新增 `domain/ai-command/guardian-teacher-message.ts`，家长 AI `sendTeacherMessage` 基于绑定学生、留言内容和候选老师生成中风险确认卡片；确认前复用 `executeConfirmedRequest` 阻断发送，确认后生成留言草稿且只包含对该学生有班级/校区授权的负责老师；家长无绑定学生权限或没有授权老师时直接拒绝。新增 `tests/unit/guardian-teacher-message.test.ts` 覆盖确认前不发送、确认后只发授权老师、非绑定学生/无授权老师拒绝。全量质量门禁通过：`npm run typecheck && npm run lint && npm run test:unit && npm run prisma:validate && npm run build && npm run test:e2e`。  
  **提交记录：** 待本轮提交。

- [ ] M7-10 家长 AI：服务有效期查询  
  **内容：** 只返回有效期和续费说明，不返回余额/欠费金额。  
  **测试：** 金额字段不在响应中。

- [ ] M7-11 老师 AI：反馈草稿  
  **内容：** 根据老师短句生成三类点评草稿。  
  **测试：** 默认草稿，不自动发布。

- [ ] M7-12 老师 AI：圈错建议  
  **内容：** 图片分析返回建议区域和置信度。  
  **测试：** 老师确认前不进入错题本。

- [ ] M7-13 老师 AI：同类题生成  
  **内容：** 生成同类题草稿。  
  **测试：** 老师勾选后才加入练习单。

- [ ] M7-14 管理端 AI：班级核算查询  
  **内容：** 按权限查询校区、班级、毛利。  
  **测试：** 校区管理员不能跨校区查，老师不能查班级毛利。

- [ ] M7-15 高风险拒绝 UI  
  **内容：** 明确显示不能执行原因和传统页面入口。  
  **测试：** “把欠费改成 0”必须拒绝。

- [ ] M7-16 AI 操作日志页面  
  **内容：** 筛选时间、用户、意图、风险、确认状态、结果。  
  **测试：** 权限隔离和日志完整性。

- [ ] M7-17 E2E：AI 确认与拒绝  
  **流程：** 家长请假确认、老师反馈草稿、管理员高风险拒绝。  
  **测试：** Playwright 通过。

---

### M8. 四端 UI 完整落地

- [ ] M8-01 将设计 token 写入 Tailwind/theme  
  **内容：** mental-health demo 色系、拟物阴影、圆角、字体。  
  **测试：** 组件页面与 `ui-design/afterclass-mvp-ui.html` 视觉一致。

- [ ] M8-02 管理端首页看板 UI  
  **内容：** KPI、趋势、风险、待处理事项、校区筛选。  
  **测试：** 1440px、1024px 响应式正常。

- [ ] M8-03 管理端 AI 经营助手 UI  
  **内容：** 对话、数据卡片、确认/拒绝卡片、快捷问题。  
  **测试：** 高风险拒绝视觉明确。

- [ ] M8-04 管理端资料管理 UI  
  **内容：** 校区、学生、班级、收费、日志。  
  **测试：** 表格、空状态、加载、错误状态齐全。

- [ ] M8-05 老师端今日托管 UI  
  **内容：** 学生列表、状态、拍照签到、到期提醒、AI 快捷录入。  
  **测试：** 平板和手机 H5 可用。

- [ ] M8-06 老师端作业批改 UI  
  **内容：** 图片、圈错、三类点评、发布、练习单。  
  **测试：** 触控区域 ≥44px。

- [ ] M8-07 家长端首页 UI  
  **内容：** 安全到达、照片、今日作业、服务有效期。  
  **测试：** 390px 手机无横向滚动。

- [ ] M8-08 家长端 AI 助手 UI  
  **内容：** 文字/语音入口、请假确认卡片、查询结果。  
  **测试：** 确认/取消路径清晰。

- [ ] M8-09 家长端作业详情 UI  
  **内容：** 原图、批改图、三类点评、错题摘要。  
  **测试：** 不展示经营数据。

- [ ] M8-10 家长端我的/服务 UI  
  **内容：** 孩子信息、通知设置、请假记录、服务有效期。  
  **测试：** 身份证脱敏。

- [ ] M8-11 学生端今日任务 UI  
  **内容：** 完成进度、待订正、鼓励、AI 学习入口。  
  **测试：** 学生只能看自己。

- [ ] M8-12 学生端错题本 UI  
  **内容：** 错题卡片、同类题练习、拍照提问入口。  
  **测试：** 移动端触控可用。

- [ ] M8-13 全局状态页面  
  **内容：** loading、empty、error、permission denied、AI thinking、voice recording。  
  **测试：** 所有核心页面至少有空状态和错误状态。

- [ ] M8-14 可访问性检查  
  **内容：** 对比度、label、aria、键盘焦点、触控尺寸。  
  **测试：** Playwright/手工检查通过。

---

### M9. 部署、监控与验收

- [ ] M9-01 创建 Dockerfile  
  **内容：** Next.js 生产镜像。  
  **测试：** 镜像可构建。

- [ ] M9-02 创建 docker-compose.yml  
  **内容：** web + postgres + volume。  
  **测试：** `docker compose up` 可启动。

- [ ] M9-03 创建 `.env.example`  
  **内容：** DATABASE_URL、AUTH_SECRET、AI_PROVIDER、STORAGE_PATH 等。  
  **测试：** 新环境按说明可配置。

- [ ] M9-04 创建数据库迁移脚本  
  **内容：** Prisma migrate。  
  **测试：** 空库可迁移成功。

- [ ] M9-05 创建 demo seed 脚本  
  **内容：** 多角色、多校区、完整样例链路。  
  **测试：** seed 后可直接演示四端。

- [ ] M9-06 创建备份脚本  
  **内容：** PostgreSQL dump + 文件目录备份说明。  
  **测试：** 本地执行生成备份文件。

- [ ] M9-07 创建日志策略  
  **内容：** 应用日志、AI 日志、审计日志、错误日志。  
  **测试：** 关键操作可追踪。

- [ ] M9-08 最终回归测试  
  **内容：** lint、typecheck、unit、integration、e2e、build。  
  **测试：** 全部通过。

- [ ] M9-09 MVP 验收演示脚本  
  **内容：** 校区建档到 AI 日志追溯完整演示路径。  
  **测试：** 按脚本 30 分钟内完成演示。

- [ ] M9-10 商用上线风险清单  
  **内容：** 数据备份、隐私、图片授权、AI 限制、收费人工复核。  
  **测试：** 风险均有处理或明确暂缓说明。

---

## 4. 测试计划详情

### 4.1 单元测试清单

- [ ] 权限：超级管理员可访问全部校区。
- [ ] 权限：校区管理员只能访问授权校区。
- [ ] 权限：老师只能访问负责班级/学生。
- [ ] 权限：家长只能访问绑定孩子。
- [ ] 权限：学生只能访问自己的任务和错题。
- [ ] 脱敏：身份证号默认脱敏。
- [ ] 审计：查看完整身份证号生成日志。
- [ ] 托管类型：只允许四种固定类型。
- [ ] 通知文案：晚辅导使用“已到托管中心”。
- [ ] 家长金融隔离：家长端 DTO 不含余额/欠费/收入/课费/毛利。
- [ ] AI 风险：低风险查询直接返回。
- [ ] AI 风险：中风险必须确认。
- [ ] AI 风险：高风险必须拒绝。
- [ ] 错题收录：只收录老师确认区域。
- [ ] Word 练习单：未选择题目不能生成。
- [ ] 核算：班级毛利 = 学生收入 - 老师课费 - 成本预留。

### 4.2 集成测试清单

- [ ] 管理员创建校区、班级、学生、绑定家长。
- [ ] 老师签到后创建学生考勤记录。
- [ ] 拍照签到生成通知，家长可见。
- [ ] 匹配失败不通知，确认后补发。
- [ ] 作业上传后生成批改草稿。
- [ ] 老师确认 AI 圈错后发布反馈。
- [ ] 发布反馈后家长可见，未发布不可见。
- [ ] 发布后错题自动收录。
- [ ] AI 生成同类题后老师确认生成 Word。
- [ ] 收费记录影响家长服务有效期。
- [ ] 班级核算按校区权限隔离。
- [ ] AI 操作日志完整记录。

### 4.3 E2E 测试清单

- [ ] 管理端基础建档流程。
- [ ] 老师端今日托管签到流程。
- [ ] 学生拍照签到 → 家长收到到托通知。
- [ ] 老师上传作业 → AI 圈错建议 → 老师发布 → 家长查看。
- [ ] 错题本 → 同类题 → Word 练习单。
- [ ] 收费录入 → 家长服务有效期展示 → 管理端班级核算。
- [ ] 家长 AI 请假确认。
- [ ] 老师 AI 反馈草稿确认。
- [ ] 管理端 AI 查询班级毛利。
- [ ] 管理端 AI 高风险修改收费被拒绝。

### 4.4 UI/UX 测试清单

- [ ] 390px 手机端无横向滚动。
- [ ] 768px 平板端老师工作台可用。
- [ ] 1024px 管理端可用。
- [ ] 1440px 管理端信息密度合理。
- [ ] 所有触控目标 ≥44px。
- [ ] 所有表单有 label 和错误提示。
- [ ] 颜色不作为唯一状态提示。
- [ ] 按钮有 hover/pressed/disabled/loading 状态。
- [ ] AI 确认卡片主次操作明确。
- [ ] 高风险拒绝卡片有传统页面入口。

### 4.5 安全测试清单

- [ ] 家长不能通过 URL 猜测访问其他学生。
- [ ] 老师不能访问未授权校区图片。
- [ ] 校区管理员不能跨校区查询核算。
- [ ] 学生不能访问其他学生错题。
- [ ] 图片 API 必须校验授权。
- [ ] 身份证完整查看必须有审计日志。
- [ ] AI 不能执行删除学生。
- [ ] AI 不能修改收费金额、余额、课费。
- [ ] AI 不能批量发送高风险通知。
- [ ] 家长端 API 响应不包含经营字段。

---

## 5. MVP 总体验收标准

当以下条件全部满足，才认为 MVP 开发完成：

- [ ] 管理员可以完成校区、班级、学生、家长、老师基础配置。
- [ ] 系统固定支持中午托、下午托、晚辅导、晚全托四种托管类型。
- [ ] 老师可以完成老师签到/签退。
- [ ] 老师可以完成学生拍照签到。
- [ ] 家长可以收到或查看孩子到托通知和照片。
- [ ] 老师可以上传作业图片并看到 AI 圈错建议。
- [ ] 老师可以确认/修改/忽略 AI 圈错区域。
- [ ] 老师可以填写或生成三类点评草稿。
- [ ] 老师确认发布后，家长可以查看作业原图、批改图、三类点评。
- [ ] 老师确认过的错题自动进入错题本。
- [ ] AI 可以生成同类题草稿，老师确认后生成 Word 练习单。
- [ ] 管理端可以记录收费和服务有效期。
- [ ] 家长端只展示服务有效期和续费提示，不展示余额/欠费金额。
- [ ] 管理端可以查看班级核算、老师课费和预估毛利。
- [ ] 老师端可以查看服务到期提醒，但不展示班级毛利。
- [ ] AI Command Layer 覆盖 9 个 MVP 意图。
- [ ] 中风险 AI 动作必须确认。
- [ ] 高风险 AI 动作必须拒绝。
- [ ] AI 操作日志完整记录。
- [ ] 所有核心数据按校区权限隔离。
- [ ] 所有图片按授权访问。
- [ ] lint、typecheck、unit、integration、e2e、build 全部通过。
- [ ] Docker Compose 可启动完整系统。

---

## 6. 后续执行建议

建议开发顺序严格按 M0 → M9 推进，不要先做炫酷 AI 或复杂报表。

第一批实际编码建议从以下 5 项开始：

1. M0-01 确认包管理器与初始化方式。
2. M0-02 初始化 Next.js App Router 项目。
3. M0-03 配置 Tailwind CSS 和 mental-health demo token。
4. M0-06 配置 Vitest。
5. M1-01 定义固定枚举并写单元测试。

每完成一项，我会更新本文复选框，直到所有 MVP 功能完成。
