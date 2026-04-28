"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Target, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { ExamSession } from "@/lib/types";

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.exams.getDetail(params.id as string).then(setExam).catch(() => {}).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-[var(--teal)] border-t-transparent rounded-full animate-spin"/></div>;
  if (!exam) return <Card padding="lg" className="text-center py-16"><p className="text-[var(--text-muted)]">Data tidak ditemukan</p></Card>;

  const score = exam.irtScore ? Math.round(exam.irtScore) : 0;
  const pct = exam.totalQuestions ? Math.round((exam.correctAnswers / exam.totalQuestions) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/dashboard/history")} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer"><ArrowLeft size={20}/></button>
        <h1 className="text-2xl font-bold text-[var(--text)]">Hasil Ujian</h1>
      </div>

      {/* Score card */}
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="gradient-teal rounded-[var(--radius-xl)] p-8 text-white text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"/>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5"/>
        <div className="relative z-10">
          <Trophy size={40} className="mx-auto mb-3 text-white/80"/>
          <h2 className="text-lg font-medium text-white/80 mb-1">{exam.title}</h2>
          <p className="text-6xl font-extrabold mb-2">{score}</p>
          <p className="text-sm text-white/70">Skor IRT (skala 0-1000)</p>
          {exam.irtTheta !== null && <p className="text-xs text-white/50 mt-1">θ = {exam.irtTheta?.toFixed(3)}</p>}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Benar", value: exam.correctAnswers, icon: CheckCircle, color: "text-[var(--success)]", bg: "bg-[var(--success-bg)]" },
          { label: "Salah", value: exam.totalQuestions - exam.correctAnswers, icon: XCircle, color: "text-[var(--error)]", bg: "bg-[var(--error-bg)]" },
          { label: "Total Soal", value: exam.totalQuestions, icon: Target, color: "text-[var(--teal)]", bg: "bg-[var(--teal-50)]" },
          { label: "Akurasi", value: `${pct}%`, icon: BarChart3, color: "text-[var(--info)]", bg: "bg-[var(--info-bg)]" },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.05}}>
            <Card padding="md" className="text-center">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}><s.icon size={20} className={s.color}/></div>
              <p className="text-2xl font-bold text-[var(--text)]">{s.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Answer review */}
      {exam.answers && exam.answers.length > 0 && (
        <Card padding="none">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h3 className="text-base font-semibold text-[var(--text)]">Review Jawaban</h3>
          </div>
          <div className="divide-y divide-[var(--border)] max-h-[500px] overflow-y-auto">
            {exam.answers.map((a, i) => (
              <div key={a.id} className="px-6 py-4 flex items-start gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${a.isCorrect ? "bg-[var(--success-bg)] text-emerald-700" : "bg-[var(--error-bg)] text-red-700"}`}>{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)] line-clamp-2">{a.question?.content || "Soal"}</p>
                  {a.question?.explanation && <p className="text-xs text-[var(--text-muted)] mt-1 italic">💡 {a.question.explanation}</p>}
                </div>
                <Badge variant={a.isCorrect ? "success" : "error"} size="sm">{a.isCorrect ? "Benar" : "Salah"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => router.push("/dashboard/history")} fullWidth>Riwayat</Button>
        <Button onClick={() => router.push("/dashboard")} fullWidth>Dashboard</Button>
      </div>
    </div>
  );
}
