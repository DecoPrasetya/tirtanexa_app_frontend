"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, FolderOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Subject, Chapter } from "@/lib/types";
import Link from "next/link";
import toast from "react-hot-toast";

type ChapterWithStats = Chapter & {
  questionStats?: { total: number; EASY: number; MEDIUM: number; HARD: number };
};

type PageProps = { params: Promise<{ subjectId: string }> };

export default function AdminChaptersInSubjectPage({ params }: PageProps) {
  const { subjectId } = use(params);
  const router = useRouter();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<ChapterWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  async function fetchData() {
    try {
      setLoading(true);
      const subjectList = await api.subjects.getAll() as any[];
      const found = subjectList.find((s: any) => s.id === subjectId);
      if (found) setSubject(found);

      const chaptersData = await api.subjects.getChapters(subjectId) as any;
      setChapters(Array.isArray(chaptersData) ? chaptersData : []);
    } catch (e) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/dashboard/admin/questions")} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          {loading ? (
            <div className="h-7 w-48 rounded-lg animate-shimmer" />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--text)]">Bank Soal: {subject?.name || "Mata Pelajaran"}</h1>
              <p className="text-sm text-[var(--text-muted)]">Pilih bab untuk melihat daftar soal.</p>
            </>
          )}
        </div>
      </div>

      {/* Chapter List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl animate-shimmer" />
          ))}
        </div>
      ) : chapters.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chapters.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card padding="none" className="rounded-3xl border border-[var(--border)] hover:border-teal-500 hover:shadow-md transition-all duration-300 h-full flex flex-col p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <FolderOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text)] line-clamp-1">{chapter.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Kode: {chapter.code}</p>
                    <p className="text-sm font-medium text-teal-600 mt-2">
                      {chapter.questionStats?.total ?? chapter._count?.questions ?? 0} Soal
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-end">
                  <Link href={`/dashboard/admin/questions/${subjectId}/${chapter.id}`} className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors bg-transparent border-none" style={{ textDecoration: "none" }}>
                    Buka Folder Bab →
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-muted)]">Belum ada bab di mata pelajaran ini.</p>
        </Card>
      )}
    </div>
  );
}
