"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { Question } from "@/lib/types";
import toast from "react-hot-toast";

type PageProps = { params: Promise<{ subjectId: string; chapterId: string; questionId: string }> };

export default function AdminQuestionDetailPage({ params }: PageProps) {
  const { subjectId, chapterId, questionId } = use(params);
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.questions.getById(questionId)
      .then((data) => setQuestion(data))
      .catch(() => toast.error("Gagal memuat detail soal"))
      .finally(() => setLoading(false));
  }, [questionId]);

  if (loading) {
    return <div className="space-y-4">
      <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
      <div className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
    </div>;
  }

  if (!question) {
    return <div className="text-center py-10">Soal tidak ditemukan</div>;
  }

  const diffBadge = { EASY: "success" as const, MEDIUM: "warning" as const, HARD: "error" as const };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push(`/dashboard/admin/questions/${subjectId}/${chapterId}`)} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Detail Soal</h1>
        </div>
      </div>

      <Card padding="lg" className="space-y-6">
        <div className="flex justify-between items-start gap-4 border-b border-[var(--border)] pb-4">
          <h3 className="text-lg font-medium text-[var(--text)] leading-relaxed flex-1 whitespace-pre-wrap">
            {question.content}
          </h3>
          <Badge variant={diffBadge[question.difficulty]} size="md">
            {question.difficulty}
          </Badge>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)]">Opsi Jawaban:</h4>
          {question.options?.map((opt) => (
            <div key={opt.id} className={`flex items-start gap-3 p-4 rounded-xl border ${opt.isCorrect ? 'border-teal-200 bg-teal-50' : 'border-[var(--border)] bg-[var(--bg-alt)]'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${opt.isCorrect ? 'bg-teal-500 text-white' : 'bg-slate-200 text-[var(--text-muted)]'}`}>
                <span className="text-xs font-bold">{opt.label}</span>
              </div>
              <p className={`text-sm flex-1 ${opt.isCorrect ? 'text-teal-900 font-medium' : 'text-[var(--text-secondary)]'}`}>
                {opt.content}
              </p>
              {opt.isCorrect && <CheckCircle2 size={18} className="text-teal-600 shrink-0" />}
            </div>
          ))}
        </div>

        {question.explanation && (
          <div className="pt-6 border-t border-[var(--border)]">
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Pembahasan:</h4>
            <div className="p-4 rounded-xl bg-violet-50 text-violet-900 text-sm leading-relaxed whitespace-pre-wrap">
              {question.explanation}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
