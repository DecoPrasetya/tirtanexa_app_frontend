"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { History, GraduationCap, BookOpen, Trophy, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { ExamSession, ExamType } from "@/lib/types";

export default function HistoryPage() {
  const [exams, setExams] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ExamType | "ALL">("ALL");

  useEffect(() => {
    api.exams.getHistory().then((d) => setExams(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? exams : exams.filter((e) => e.type === filter);
  const typeIcon = (t: ExamType) => t === "PRACTICE" ? GraduationCap : t === "TRYOUT" ? BookOpen : Trophy;
  const typeLabel = (t: ExamType) => t === "PRACTICE" ? "Latihan" : t === "TRYOUT" ? "Tryout" : "Turnamen";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Riwayat Ujian</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Semua ujian yang pernah kamu kerjakan</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["ALL","PRACTICE","TRYOUT","TOURNAMENT"] as const).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${filter === t ? "bg-[var(--teal)] text-white" : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--teal)]"}`}>
            {t === "ALL" ? "Semua" : typeLabel(t as ExamType)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="h-20 rounded-xl animate-shimmer"/>)}</div>
      ) : filtered.length > 0 ? (
        <Card padding="none">
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((exam, i) => {
              const Icon = typeIcon(exam.type);
              return (
                <motion.div key={exam.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}>
                  <Link href={`/dashboard/exams/${exam.id}/result`} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--surface-hover)] transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${exam.type === "PRACTICE" ? "gradient-teal" : exam.type === "TRYOUT" ? "gradient-orange" : "bg-[var(--info)]"}`}>
                      <Icon size={18}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{exam.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[var(--text-muted)]">{new Date(exam.startedAt).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</span>
                        <Badge variant={exam.status === "COMPLETED" ? "success" : exam.status === "IN_PROGRESS" ? "warning" : "default"} size="sm">
                          {exam.status === "COMPLETED" ? "Selesai" : exam.status === "IN_PROGRESS" ? "Berlangsung" : "Ditinggalkan"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-[var(--teal)]">{exam.irtScore ? Math.round(exam.irtScore) : "—"}</p>
                      <p className="text-xs text-[var(--text-muted)]">{exam.correctAnswers}/{exam.totalQuestions}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <History size={48} className="mx-auto text-[var(--text-muted)] mb-4"/>
          <p className="text-base font-medium text-[var(--text-secondary)]">Belum ada riwayat ujian</p>
        </Card>
      )}
    </div>
  );
}
