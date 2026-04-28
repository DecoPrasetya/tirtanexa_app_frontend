"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Play, BarChart2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Chapter, Subject } from "@/lib/types";

export default function SubjectChaptersPage() {
  const params = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const subjectId = params.id as string;

  useEffect(() => {
    async function fetchChapters() {
      try {
        const data = await api.subjects.getChapters(subjectId);
        setChapters(Array.isArray(data) ? data : []);
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [subjectId]);

  const subjectName = chapters[0]?.subject?.name || "Mata Pelajaran";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{subjectName}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Pilih bab untuk mulai latihan
          </p>
        </div>
      </div>

      {/* Chapters */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-[var(--radius-lg)] animate-shimmer" />
          ))}
        </div>
      ) : chapters.length > 0 ? (
        <div className="space-y-3">
          {chapters.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card padding="lg" className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-[var(--teal-50)] flex items-center justify-center text-[var(--teal)] font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--text)]">
                      {chapter.name}
                    </h3>
                    {chapter.description && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                        {chapter.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="teal" size="sm">
                        {chapter._count?.questions || 0} soal
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  leftIcon={<Play size={14} />}
                  onClick={() =>
                    router.push(
                      `/dashboard/exams/practice?chapterId=${chapter.id}&chapterName=${encodeURIComponent(chapter.name)}`
                    )
                  }
                >
                  Mulai Latihan
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-base font-medium text-[var(--text-secondary)]">
            Belum ada bab
          </p>
        </Card>
      )}
    </div>
  );
}
