"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Layers, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { Subject, Category } from "@/lib/types";

const categoryColors: Record<Category, "teal" | "orange" | "info" | "success"> = {
  UTBK: "orange",
  SD: "success",
  SMP: "info",
  SMA: "teal",
};

const categoryIcons: Record<Category, string> = {
  UTBK: "🎯",
  SD: "📚",
  SMP: "📖",
  SMA: "🎓",
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "ALL">("ALL");

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const data = await api.subjects.getAll();
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        // Backend might not be running
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  const filtered = subjects.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "ALL" || s.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Mata Pelajaran</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Pilih mata pelajaran untuk mulai latihan soal
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Cari mata pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "UTBK", "SD", "SMP", "SMA"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                filterCategory === cat
                  ? "bg-[var(--teal)] text-white shadow-sm"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--teal)]"
              }`}
            >
              {cat === "ALL" ? "Semua" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-[var(--radius-lg)] animate-shimmer" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/dashboard/subjects/${subject.id}`}>
                <Card variant="interactive" padding="lg" className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--teal-50)] flex items-center justify-center text-2xl">
                      {categoryIcons[subject.category]}
                    </div>
                    <Badge variant={categoryColors[subject.category]} size="sm">
                      {subject.category}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text)] mb-1">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2">
                    {subject.description || "Latihan soal untuk mata pelajaran ini"}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <Layers size={14} />
                      <span>{subject._count?.chapters || 0} bab</span>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-muted)]" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-base font-medium text-[var(--text-secondary)]">
            Belum ada mata pelajaran
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Mata pelajaran akan muncul setelah admin menambahkannya
          </p>
        </Card>
      )}
    </div>
  );
}
