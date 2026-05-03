# AfterClass Docker Compose 部署烟测

本步骤用于在**真实部署机**验证 `Dockerfile` 与 `docker-compose.yml` 可以构建并启动完整系统。当前开发环境没有 Docker CLI 时，不应勾选计划中的“Docker Compose 可启动完整系统”。

## 前置条件

- 部署机已安装 Docker 与 Docker Compose v2。
- 已完成 `.env` 配置，且至少包含非占位值：
  - `AUTH_SECRET`
  - `POSTGRES_PASSWORD`
  - 如接入 AI，再配置 `AI_PROVIDER` 与对应 Provider 密钥。
- `WEB_PORT` 未被占用，默认 `3000`。
- 生产密钥、数据库密码、AI Key 不得写入 Git、截图或群消息。

## 执行命令

```bash
cp .env.example .env
# 编辑 .env，替换 AUTH_SECRET、POSTGRES_PASSWORD 等占位值
npm run deploy:smoke
```

脚本会执行：

1. 校验 Docker / Docker Compose 可用。
2. 拒绝 `AUTH_SECRET`、`POSTGRES_PASSWORD` 等占位值。
3. 执行 `docker compose config`。
4. 执行 `docker compose build`。
5. 执行 `docker compose up -d postgres web`。
6. 访问 `http://127.0.0.1:${WEB_PORT:-3000}/`，确认页面返回 AfterClass 启动内容。
7. 输出 `docker compose ps` 作为验收记录。

如只是一次性验收并希望脚本结束后自动清理容器：

```bash
SMOKE_CLEANUP=true npm run deploy:smoke
```

## 通过标准

- 终端输出包含：

```text
Deployment smoke verification passed.
```

- `docker compose ps` 显示 `postgres` 与 `web` 处于运行状态。
- 首页响应包含“智能晚辅托管系统”。

## 失败处理

- 如果提示 `docker is required`：说明当前机器不是部署机或未安装 Docker，不能勾选 Docker 启动验收。
- 如果提示占位值：先替换 `.env` 中的 `AUTH_SECRET`、`POSTGRES_PASSWORD`，不要使用示例密码上线。
- 如果 Web 超时：查看脚本自动输出的 `docker compose ps` 与 `docker compose logs --tail=120 web`。
- 如果端口占用：改用 `WEB_PORT=其他端口 npm run deploy:smoke`。
