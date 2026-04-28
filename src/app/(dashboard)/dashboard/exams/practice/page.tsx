"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Settings2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { Subject, Chapter } from "@/lib/types";
import toast from "react-hot-toast";

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedChapterId = searchParams.get("chapterId");
  const preselectedChapterName = searchParams.get("chapterName");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(preselectedChapterId || "");
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const data = await api.subjects.getAll();
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        // silently handle
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject) {
      setChapters([]);
      return;
    }
    async function fetchChapters() {
      try {
        const data = await api.subjects.getChapters(selectedSubject);
        setChapters(Array.isArray(data) ? data : []);
      } catch {
        // silently handle
      }
    }
    fetchChapters();
  }, [selectedSubject]);

  const handleStart = async () => {
    if (!selectedChapter) {
      toast.error("Pilih bab terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const exam = await api.exams.startPractice({
        chapterId: selectedChapter,
        difficulty: difficulty === "ALL" ? undefined : difficulty,
        questionCount,
      });
      router.push(`/dashboard/exams/${exam.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal memulai latihan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Latihan Soal</h1>
          <p className="text-sm text-[var(--text-muted)]">Atur latihan sesuai kebutuhanmu</p>
        </div>
      </div>

      <Card padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
          <div className="p-2.5 rounded-xl gradient-teal text-white"><Settings2 size={20} /></div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">Pengaturan Latihan</h2>
            <p className="text-xs text-[var(--text-muted)]">Pilih bab, tingkat kesulitan, dan jumlah soal</p>
          </div>
        </div>

        {preselectedChapterId ? (
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Bab Terpilih</label>
            <div className="px-4 py-3 rounded-[var(--radius-md)] bg-[var(--teal-50)] border border-[var(--teal)]/20">
              <p className="text-sm font-medium text-[var(--teal)]">{preselectedChapterName || "Bab terpilih"}</p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Mata Pelajaran</label>
              <select
                value={selectedSubject}
                onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(""); }}
                className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] cursor-pointer"
              >
                <option value="">Pilih mata pelajaran</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Bab</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                disabled={!selectedSubject}
                className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] disabled:opacity-50 cursor-pointer"
              >
                <option value="">Pilih bab</option>
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Tingkat Kesulitan</label>
          <div className="flex gap-2 flex-wrap">
            {[{ v: "ALL", l: "Semua" }, { v: "EASY", l: "Mudah" }, { v: "MEDIUM", l: "Sedang" }, { v: "HARD", l: "Sulit" }].map((d) => (
              <button
                key={d.v}
                onClick={() => setDifficulty(d.v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  difficulty === d.v ? "bg-[var(--teal)] text-white" : "bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                {d.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Jumlah Soal: <span className="text-[var(--teal)] font-bold">{questionCount}</span></label>
          <input
            type="range" min="5" max="50" step="5"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-[var(--teal)] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>5</span><span>50</span>
          </div>
        </div>

        <Button fullWidth size="lg" isLoading={loading} leftIcon={<Play size={18} />} onClick={handleStart}>
          Mulai Latihan
        </Button>
      </Card>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="space-y-4"><div className="h-8 w-48 animate-shimmer rounded-lg" /><div className="h-96 animate-shimmer rounded-xl" /></div>}>
      <PracticeContent />
    </Suspense>
  );
}
