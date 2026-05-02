'use client';

import { useState } from 'react';

export function TeacherPhotoCheckInDemo() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <section className="mx-auto max-w-3xl space-y-6 rounded-[2rem] bg-surface p-6 shadow-neu-sm">
        <div>
          <p className="text-sm font-semibold text-muted">Photo Check-in</p>
          <h1 className="font-heading text-3xl font-bold">拍照签到</h1>
          <p className="mt-3 text-sm text-muted">老师确认学生已到托后，系统生成考勤记录、私有照片引用和家长到托通知。</p>
        </div>

        <article className="rounded-3xl bg-background p-5 shadow-neu-sm">
          <h2 className="text-xl font-bold">王小明</h2>
          <p className="mt-2 text-sm text-muted">东城托管中心 · 东城三年级晚辅 A 班 · 晚辅导</p>
          <p className="mt-4 rounded-2xl bg-surfaceAlt px-4 py-3 text-sm text-muted">照片将以私有文件授权方式提供给绑定家长，不生成公开 URL。</p>
          <button
            className="mt-5 min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            type="button"
            onClick={() => setConfirmed(true)}
          >
            确认已到托管中心并通知家长
          </button>
        </article>

        {confirmed ? (
          <p className="rounded-3xl bg-mint/40 p-5 text-sm font-semibold">到托记录已生成，家长端安全到达卡片可查看照片引用。</p>
        ) : null}
      </section>
    </main>
  );
}
