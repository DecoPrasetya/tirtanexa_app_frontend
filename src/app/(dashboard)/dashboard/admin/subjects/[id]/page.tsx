"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, BookOpen, X, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { Subject, Chapter } from "@/lib/types";
import toast from "react-hot-toast";

type ChapterWithStats = Chapter & {
  questionStats?: { total: number; EASY: number; MEDIUM: number; HARD: number };
};

type PageProps = { params: Promise<{ id: string }> };

export default function AdminSubjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<ChapterWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      setLoading(true);
      // Get subject info
      const subjectList = await api.subjects.getAll() as any[];
      const found = subjectList.find((s: any) => s.id === id);
      if (found) setSubject(found);
      // Get chapters - backend now returns plain array
      const chapters = await api.subjects.getChapters(id) as any;
      setChapters(Array.isArray(chapters) ? chapters : []);
    } catch (e) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async () => {
    if (!name.trim() || !code.trim()) { toast.error("Nama dan kode wajib diisi"); return; }
    setSaving(true);
    try {
      const chapter = await api.subjects.createChapter(id, { name, code, description: description || undefined });
      setChapters(p => [...p, chapter as ChapterWithStats]);
      setName(""); setCode(""); setDescription(""); setShowForm(false);
      toast.success("Bab berhasil ditambahkan!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menambah bab");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (chapterId: string, chapterName: string) => {
    if (!confirm(`Hapus bab "${chapterName}"? Semua soal di dalamnya akan ikut terhapus.`)) return;
    try {
      await api.subjects.deleteChapter(chapterId);
      setChapters(p => p.filter(c => c.id !== chapterId));
      toast.success("Bab dihapus");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus bab");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          {loading ? (
            <div className="h-7 w-48 rounded-lg animate-shimmer" />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--text)]">{subject?.name || "Mata Pelajaran"}</h1>
              <p className="text-sm text-[var(--text-muted)]">Kode: {subject?.code} · Kelola bab di bawah ini</p>
            </>
          )}
        </div>
      </div>

      {/* Add Chapter Button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[var(--text-secondary)]">
          {chapters.length} bab terdaftar
        </p>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowForm(true)}>
          Tambah Bab
        </Button>
      </div>

      {/* Add Chapter Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card padding="lg" className="border-2 border-[var(--teal)] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[var(--text)]">Bab Baru</h3>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Bab"
                  placeholder="contoh: Penalaran Logis"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <Input
                  label="Kode Bab"
                  placeholder="contoh: PU-LOG"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                />
              </div>
              <Input
                label="Deskripsi (opsional)"
                placeholder="Deskripsi singkat bab ini"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
                <Button isLoading={saving} leftIcon={<Save size={16} />} onClick={handleCreate}>
                  Simpan Bab
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-shimmer" />
          ))}
        </div>
      ) : chapters.length ? (
        <Card padding="none">
          <div className="divide-y divide-[var(--border)]">
            {chapters.map((chapter, i) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4"
              >
                <span className="w-8 h-8 rounded-lg bg-[var(--teal-50)] text-[var(--teal)] flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text)] text-sm">{chapter.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--text-muted)]">Kode: {chapter.code}</span>
                    <span className="text-xs text-[var(--text-muted)]">·</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {chapter.questionStats?.total ?? chapter._count?.questions ?? 0} soal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(chapter.id, chapter.name)}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-muted)]">Belum ada bab. Klik "Tambah Bab" untuk memulai.</p>
        </Card>
      )}
    </div>
  );
}
