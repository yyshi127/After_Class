# AfterClass 备份与恢复说明

本说明用于 M9 部署阶段的最小可用备份方案，覆盖 PostgreSQL 数据库与本地私有文件目录。

## 备份范围

- PostgreSQL：使用 `pg_dump --format=custom` 生成 `postgres.dump`。
- 私有文件目录：使用 `tar.gz` 归档 `STORAGE_PATH`，包括到托照片、作业原图/批改图、练习单等私有文件。
- manifest：每次备份生成 `backup-manifest.txt`，记录备份时间、文件名和恢复命令模板。

## 执行备份

```bash
DATABASE_URL="postgresql://..." STORAGE_PATH="./storage" BACKUP_DIR="./backups" bash scripts/backup.sh
```

如果项目根目录存在 `.env`，脚本会自动加载；生产环境建议由进程管理器或 CI/CD 注入环境变量。

默认输出目录：

```text
./backups/afterclass-YYYYMMDDTHHMMSSZ/
├── postgres.dump
├── storage.tar.gz
└── backup-manifest.txt
```

## 恢复数据库

在目标数据库已创建且 `DATABASE_URL` 指向目标库后执行：

```bash
pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$DATABASE_URL" postgres.dump
```

## 恢复私有文件

```bash
mkdir -p "$STORAGE_PATH"
tar -xzf storage.tar.gz -C "$STORAGE_PATH"
```

## 运营建议

- 至少每日备份一次数据库与私有文件目录。
- 备份文件应加密后离线或异地保存。
- 定期在临时库/临时目录演练恢复，不能只验证“备份文件存在”。
- 备份目录已加入 `.gitignore`，不得提交真实备份、学生照片、作业图片或任何生产数据。
