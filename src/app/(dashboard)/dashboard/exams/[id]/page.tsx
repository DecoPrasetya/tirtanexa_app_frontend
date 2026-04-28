"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import type { ExamSession, ExamAnswer } from "@/lib/types";
import toast from "react-hot-toast";

export default function ExamSessionPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<ExamSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    api.exams.getDetail(examId).then((d) => {
      setExam(d);
      if (d.timeLimit) setTimeLeft(d.timeLimit * 60);
      const existing: Record<string, string> = {};
      d.answers?.forEach((a) => { if (a.selectedOptionId) existing[a.questionId] = a.selectedOptionId; });
      setAnswers(existing);
    }).catch(() => toast.error("Gagal memuat ujian")).finally(() => setLoading(false));
  }, [examId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => (p && p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) handleFinish();
  }, [timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const currentQuestion = exam?.answers?.[currentIdx]?.question;
  const currentQuestionId = exam?.answers?.[currentIdx]?.questionId || "";

  const handleAnswer = async (optionId: string) => {
    setAnswers((p) => ({ ...p, [currentQuestionId]: optionId }));
    try {
      await api.exams.submitAnswer(examId, { questionId: currentQuestionId, selectedOptionId: optionId });
    } catch { /* silent */ }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await api.exams.finish(examId);
      toast.success("Ujian selesai!");
      router.push(`/dashboard/exams/${examId}/result`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyelesaikan");
    } finally { setSubmitting(false); setShowFinish(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-3 border-[var(--teal)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!exam || !exam.answers?.length) return (
    <Card padding="lg" className="text-center py-16">
      <p className="text-[var(--text-muted)]">Data ujian tidak ditemukan</p>
      <Button className="mt-4" onClick={() => router.push("/dashboard")}>Kembali</Button>
    </Card>
  );

  const total = exam.answers.length;
  const answered = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-bold text-[var(--text)]">{exam.title}</h1>
        <div className="flex items-center gap-3">
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${timeLeft < 300 ? "bg-[var(--error-bg)] text-[var(--error)]" : "bg-[var(--teal-50)] text-[var(--teal)]"}`}>
              <Clock size={16}/> {formatTime(timeLeft)}
            </div>
          )}
          <span className="text-sm text-[var(--text-muted)]">{answered}/{total} dijawab</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 rounded-full bg-[var(--bg-alt)] overflow-hidden">
        <motion.div animate={{width:`${(answered/total)*100}%`}} className="h-full rounded-full gradient-teal"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Question */}
        <Card padding="lg" className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span className="px-2.5 py-1 rounded-lg bg-[var(--teal-50)] text-[var(--teal)] font-semibold">Soal {currentIdx+1}</span>
            <span>dari {total}</span>
          </div>
          <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">{currentQuestion?.content || "..."}</div>
          {currentQuestion?.imageUrl && <img src={currentQuestion.imageUrl} alt="" className="rounded-xl max-h-64 object-contain"/>}

          <div className="space-y-3">
            {currentQuestion?.options?.sort((a,b)=>a.order-b.order).map((opt) => {
              const sel = answers[currentQuestionId] === opt.id;
              return (
                <button key={opt.id} onClick={() => handleAnswer(opt.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${sel ? "border-[var(--teal)] bg-[var(--teal-50)]" : "border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${sel ? "gradient-teal text-white" : "bg-[var(--bg)] text-[var(--text-secondary)]"}`}>{opt.label}</span>
                  <span className="text-sm text-[var(--text)] pt-1">{opt.content}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" disabled={currentIdx===0} leftIcon={<ChevronLeft size={16}/>} onClick={()=>setCurrentIdx(p=>p-1)}>Sebelumnya</Button>
            {currentIdx < total-1 ? (
              <Button size="sm" rightIcon={<ChevronRight size={16}/>} onClick={()=>setCurrentIdx(p=>p+1)}>Selanjutnya</Button>
            ) : (
              <Button variant="accent" size="sm" leftIcon={<Flag size={16}/>} onClick={()=>setShowFinish(true)}>Selesai</Button>
            )}
          </div>
        </Card>

        {/* Navigator */}
        <Card padding="md" className="space-y-4 h-fit">
          <h3 className="text-sm font-semibold text-[var(--text)]">Navigasi Soal</h3>
          <div className="grid grid-cols-5 gap-2">
            {exam.answers.map((a, i) => {
              const isAnswered = !!answers[a.questionId];
              const isCurrent = i === currentIdx;
              return (
                <button key={a.id} onClick={() => setCurrentIdx(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isCurrent ? "gradient-teal text-white ring-2 ring-[var(--teal)]/30" : isAnswered ? "bg-[var(--teal-50)] text-[var(--teal)]" : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--bg-alt)]"}`}>
                  {i+1}
                </button>
              );
            })}
          </div>
          <Button variant="accent" fullWidth size="sm" leftIcon={<Flag size={14}/>} onClick={()=>setShowFinish(true)}>Selesai</Button>
        </Card>
      </div>

      <Modal isOpen={showFinish} onClose={()=>setShowFinish(false)} title="Selesaikan Ujian?">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--warning-bg)]">
            <AlertTriangle size={20} className="text-[var(--warning)]"/>
            <p className="text-sm text-amber-800">{total-answered} soal belum dijawab</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={()=>setShowFinish(false)}>Kembali</Button>
            <Button variant="accent" fullWidth isLoading={submitting} onClick={handleFinish}>Ya, Selesai</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
