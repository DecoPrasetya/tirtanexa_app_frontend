"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Search, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { Question } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.questions.getAll().then((d) => setQuestions(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
      <h1 className="text-2xl font-bold text-[var(--text)]">Bank Soal (Admin)</h1>
      <div className="max-w-sm"><Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={18}/>}/></div>
      {loading ? <div className="space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="h-16 rounded-xl animate-shimmer"/>)}</div> : filtered.length ? (
        <Card padding="none"><div className="divide-y divide-[var(--border)]">
          {filtered.map((q, i) => (
            <div key={q.id} className="flex items-center gap-4 px-6 py-3">
              <span className="w-8 h-8 rounded-lg bg-[var(--teal-50)] text-[var(--teal)] flex items-center justify-center text-xs font-bold">{i+1}</span>
              <div className="flex-1 min-w-0"><p className="text-sm text-[var(--text)] line-clamp-1">{q.content}</p><Badge variant={diffBadge[q.difficulty]} size="sm">{q.difficulty}</Badge></div>
              <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] cursor-pointer"><Trash2 size={16}/></button>
            </div>
          ))}
        </div></Card>
      ) : <Card padding="lg" className="text-center py-16"><ClipboardList size={48} className="mx-auto text-[var(--text-muted)] mb-4"/><p className="text-[var(--text-muted)]">Tidak ada soal</p></Card>}
    </div>
  );
}
