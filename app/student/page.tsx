import { RoleShell } from '@/components/role-shell';

export default function StudentPage() {
  return (
    <RoleShell
      label="Student Portal"
      title="学生端今日任务"
      description="用于学生查看今日待完成任务、待订正错题、错题本和 AI 拍照提问入口。"
      highlights={["今日任务", "待订正错题", "同类题练习"]}
    />
  );
}
