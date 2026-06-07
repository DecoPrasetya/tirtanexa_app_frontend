"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Trash2, Plus, ClipboardList, Eye } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Question, Chapter, Subject } from "@/lib/types";
import toast from "react-hot-toast";

type PageProps = { params: Promise<{ subjectId: string; chapterId: string }> };

export default function AdminQuestionsInChapterPage({ params }: PageProps) {
  const { subjectId, chapterId } = use(params);
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [subjectId, chapterId]);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Get Subject Info
      const subjectList = await api.subjects.getAll() as any[];
      const foundSub = subjectList.find((s: any) => s.id === subjectId);
      if (foundSub) setSubject(foundSub);

      // Get Chapter Info
      const chapterData = await api.subjects.getChapter(chapterId);
      if (chapterData) setChapter(chapterData);

      // Get Questions for this chapter
      const questionsData = await api.questions.getAll({ chapterId });
      setQuestions(Array.isArray(questionsData) ? questionsData : []);

    } catch (e) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  const filtered = questions.filter((q) => q.content.toLowerCase().includes(search.toLowerCase()));
  const diffBadge = { EASY: "success" as const, MEDIUM: "warning" as const, HARD: "error" as const };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus soal ini?")) return;
    try {
      await api.questions.delete(id);
      setQuestions((p) => p.filter((q) => q.id !== id));
      toast.success("Dihapus");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Gagal"); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => router.push(`/dashboard/admin/questions/${subjectId}`)} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          {loading && !chapter ? (
            <div className="h-7 w-48 rounded-lg animate-shimmer" />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--text)]">{chapter?.name || "Bab"}</h1>
              <p className="text-sm text-[var(--text-muted)]">{subject?.name} · {chapter?.code}</p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="max-w-sm w-full">
          <Input placeholder="Cari soal..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18}/>}/>
        </div>
        <Link href={`/dashboard/admin/questions/create?subjectId=${subjectId}&chapterId=${chapterId}`}>
          <Button leftIcon={<Plus size={18}/>}>Tambah Soal</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({length:5}).map((_,i) => <div key={i} className="h-16 rounded-xl animate-shimmer"/>)}
        </div>
      ) : filtered.length ? (
        <Card padding="none">
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((q, i) => (
              <div key={q.id} className="flex items-center gap-4 px-6 py-4">
                <span className="w-8 h-8 rounded-lg bg-[var(--teal-50)] text-[var(--teal)] flex items-center justify-center text-xs font-bold shrink-0">
                  {i+1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)] line-clamp-2">{q.content}</p>
                  <div className="mt-1">
                    <Badge variant={diffBadge[q.difficulty]} size="sm">{q.difficulty}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/dashboard/admin/questions/${subjectId}/${chapterId}/${q.id}`} className="p-2 rounded-lg text-teal-600 hover:bg-teal-50 cursor-pointer">
                    <Eye size={16}/>
                  </Link>
                  <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] cursor-pointer">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <ClipboardList size={48} className="mx-auto text-[var(--text-muted)] mb-4"/>
          <p className="text-[var(--text-muted)]">Belum ada soal di bab ini.</p>
        </Card>
      )}
    </div>
  );
}
