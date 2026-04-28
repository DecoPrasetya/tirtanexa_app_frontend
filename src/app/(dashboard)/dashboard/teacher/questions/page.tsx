"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, Plus, Search, Trash2, Edit, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { Question } from "@/lib/types";
import toast from "react-hot-toast";

export default function TeacherQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.questions.getAll().then((d) => setQuestions(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = questions.filter((q) => q.content.toLowerCase().includes(search.toLowerCase()));
  const diffBadge = { EASY: "success" as const, MEDIUM: "warning" as const, HARD: "error" as const };
  const diffLabel = { EASY: "Mudah", MEDIUM: "Sedang", HARD: "Sulit" };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus soal ini?")) return;
    try {
      await api.questions.delete(id);
      setQuestions((p) => p.filter((q) => q.id !== id));
      toast.success("Soal dihapus");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Bank Soal</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{questions.length} soal tersedia</p>
        </div>
        <Link href="/dashboard/teacher/questions/create">
          <Button leftIcon={<Plus size={16}/>}>Buat Soal</Button>
        </Link>
      </div>

      <div className="max-w-sm">
        <Input placeholder="Cari soal..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18}/>}/>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="h-20 rounded-xl animate-shimmer"/>)}</div>
      ) : filtered.length > 0 ? (
        <Card padding="none">
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((q, i) => (
              <motion.div key={q.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}} className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--teal-50)] flex items-center justify-center text-[var(--teal)] font-bold text-sm flex-shrink-0">{i+1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)] line-clamp-1">{q.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={diffBadge[q.difficulty]} size="sm">{diffLabel[q.difficulty]}</Badge>
                    {q.chapter && <span className="text-xs text-[var(--text-muted)]">{q.chapter.name}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer"><Trash2 size={16}/></button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <ClipboardList size={48} className="mx-auto text-[var(--text-muted)] mb-4"/>
          <p className="text-[var(--text-secondary)] font-medium">Belum ada soal</p>
          <Link href="/dashboard/teacher/questions/create" className="mt-3 inline-block"><Button size="sm">Buat Soal Pertama</Button></Link>
        </Card>
      )}
    </div>
  );
}
