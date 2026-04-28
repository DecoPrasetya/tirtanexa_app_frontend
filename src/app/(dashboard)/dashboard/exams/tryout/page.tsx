"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Play, FileText, CheckSquare } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { Subject } from "@/lib/types";
import toast from "react-hot-toast";

export default function TryoutPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    api.subjects.getAll().then((d) => {
      setSubjects((Array.isArray(d) ? d : []).filter((s) => s.category === "UTBK"));
    }).catch(() => {}).finally(() => setLoadingSub(false));
  }, []);

  const toggle = (id: string) =>
    setSelected((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const handleStart = async () => {
    if (!selected.length) { toast.error("Pilih minimal 1 mapel"); return; }
    setLoading(true);
    try {
      const exam = await api.exams.startTryout({ subjectIds: selected });
      router.push(`/dashboard/exams/${exam.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal memulai tryout");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Tryout UTBK</h1>
          <p className="text-sm text-[var(--text-muted)]">Simulasi ujian UTBK</p>
        </div>
      </div>
      <Card padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
          <div className="p-2.5 rounded-xl gradient-orange text-white"><FileText size={20} /></div>
          <h2 className="text-base font-semibold text-[var(--text)]">Pilih Mata Pelajaran</h2>
        </div>
        {loadingSub ? (
          <div className="space-y-3">{Array.from({length:4}).map((_,i)=>(<div key={i} className="h-16 rounded-xl animate-shimmer"/>))}</div>
        ) : subjects.length ? (
          <div className="space-y-3">
            {subjects.map((s, i) => (
              <motion.button key={s.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                onClick={() => toggle(s.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${selected.includes(s.id) ? "border-[var(--orange)] bg-[var(--orange-50)]" : "border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${selected.includes(s.id) ? "border-[var(--orange)] bg-[var(--orange)] text-white" : "border-[var(--border)]"}`}>
                  {selected.includes(s.id) && <CheckSquare size={14}/>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text)]">{s.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{s.description || "UTBK"}</p>
                </div>
                <Badge variant="orange" size="sm">UTBK</Badge>
              </motion.button>
            ))}
          </div>
        ) : <p className="text-center text-sm text-[var(--text-muted)] py-8">Belum ada mapel UTBK</p>}
        <Button variant="accent" fullWidth size="lg" isLoading={loading} leftIcon={<Play size={18}/>} onClick={handleStart}>
          Mulai Tryout
        </Button>
      </Card>
    </div>
  );
}
